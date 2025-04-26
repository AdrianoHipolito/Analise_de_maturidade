import { db } from "./db";

export interface MaturityResult {
  overallScore: number;
  maturityLevel: string;
  dimensions: {
    id: number;
    name: string;
    score: number;
    maturityLevel: string;
    criteria: {
      id: number;
      name: string;
      response: number;
    }[];
  }[];
  recommendations: {
    dimension: string;
    actions: string[];
  }[];
}

// Função para calcular resultados de maturidade
export async function calculateMaturityResults(assessmentId: number): Promise<MaturityResult> {
  // Buscar informações da avaliação
  const assessmentResult = await db
    .prepare(`
      SELECT a.id, a.questionnaire_template_id, a.company_name, a.user_id
      FROM assessments a
      WHERE a.id = ?
    `)
    .bind(assessmentId)
    .all();

  if (assessmentResult.results.length === 0) {
    throw new Error("Assessment not found");
  }

  const assessment = assessmentResult.results[0];

  // Buscar dimensões do questionário
  const dimensionsResult = await db
    .prepare(`
      SELECT d.id, d.name, d.description, d.weight, d.order_num
      FROM dimensions d
      WHERE d.questionnaire_template_id = ?
      ORDER BY d.order_num
    `)
    .bind(assessment.questionnaire_template_id)
    .all();

  const dimensions = dimensionsResult.results;

  // Para cada dimensão, buscar critérios e respostas
  const dimensionsWithCriteria = await Promise.all(
    dimensions.map(async (dimension) => {
      // Buscar critérios da dimensão
      const criteriaResult = await db
        .prepare(`
          SELECT c.id, c.name, c.description, c.order_num
          FROM criteria c
          WHERE c.dimension_id = ?
          ORDER BY c.order_num
        `)
        .bind(dimension.id)
        .all();

      const criteria = criteriaResult.results;

      // Para cada critério, buscar resposta
      const criteriaWithResponses = await Promise.all(
        criteria.map(async (criterion) => {
          // Buscar resposta para o critério
          const responseResult = await db
            .prepare(`
              SELECT r.maturity_level
              FROM responses r
              WHERE r.assessment_id = ? AND r.criteria_id = ?
            `)
            .bind(assessmentId, criterion.id)
            .all();

          const response = responseResult.results.length > 0
            ? responseResult.results[0].maturity_level
            : 0;

          return {
            ...criterion,
            response,
          };
        })
      );

      // Calcular pontuação da dimensão
      const totalScore = criteriaWithResponses.reduce(
        (sum, criterion) => sum + criterion.response,
        0
      );
      const averageScore = criteriaWithResponses.length > 0
        ? totalScore / criteriaWithResponses.length
        : 0;

      // Determinar nível de maturidade
      const maturityLevel = calculateMaturityLevel(averageScore);

      return {
        ...dimension,
        score: parseFloat(averageScore.toFixed(1)),
        maturityLevel,
        criteria: criteriaWithResponses,
      };
    })
  );

  // Calcular pontuação geral
  const totalWeightedScore = dimensionsWithCriteria.reduce(
    (sum, dimension) => sum + dimension.score * dimension.weight,
    0
  );
  const totalWeight = dimensionsWithCriteria.reduce(
    (sum, dimension) => sum + dimension.weight,
    0
  );
  const overallScore = totalWeight > 0
    ? totalWeightedScore / totalWeight
    : 0;

  // Determinar nível de maturidade geral
  const maturityLevel = calculateMaturityLevel(overallScore);

  // Gerar recomendações
  const recommendations = generateRecommendations(dimensionsWithCriteria);

  return {
    overallScore: parseFloat(overallScore.toFixed(1)),
    maturityLevel,
    dimensions: dimensionsWithCriteria,
    recommendations,
  };
}

// Função para calcular nível de maturidade
function calculateMaturityLevel(score: number): string {
  if (score < 1.0) return "Inexistente";
  if (score < 2.0) return "Inexistente";
  if (score < 3.0) return "Básico";
  if (score < 4.0) return "Intermediário";
  if (score < 5.0) return "Avançado";
  return "Otimizado";
}

// Função para gerar recomendações
function generateRecommendations(dimensions: any[]) {
  // Ordenar dimensões por pontuação (menor para maior)
  const sortedDimensions = [...dimensions].sort((a, b) => a.score - b.score);
  
  // Pegar as 2 dimensões com menor pontuação
  const lowScoreDimensions = sortedDimensions.slice(0, 2);
  
  return lowScoreDimensions.map(dimension => {
    const actions = [];
    
    if (dimension.score < 2) {
      actions.push(`Estabelecer processos básicos para ${dimension.name.toLowerCase()}`);
      actions.push(`Desenvolver documentação inicial para ${dimension.name.toLowerCase()}`);
      actions.push(`Implementar ferramentas básicas para apoiar ${dimension.name.toLowerCase()}`);
    } else if (dimension.score < 3) {
      actions.push(`Formalizar processos de ${dimension.name.toLowerCase()}`);
      actions.push(`Implementar métricas para monitorar ${dimension.name.toLowerCase()}`);
      actions.push(`Integrar ferramentas existentes para ${dimension.name.toLowerCase()}`);
    } else if (dimension.score < 4) {
      actions.push(`Otimizar processos de ${dimension.name.toLowerCase()}`);
      actions.push(`Implementar análise avançada para ${dimension.name.toLowerCase()}`);
      actions.push(`Desenvolver automação para ${dimension.name.toLowerCase()}`);
    } else {
      actions.push(`Implementar melhoria contínua para ${dimension.name.toLowerCase()}`);
      actions.push(`Desenvolver análise preditiva para ${dimension.name.toLowerCase()}`);
      actions.push(`Explorar inovações em ${dimension.name.toLowerCase()}`);
    }
    
    return {
      dimension: dimension.name,
      actions
    };
  });
}
