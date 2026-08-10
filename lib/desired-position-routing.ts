export type ApplicationDestination = "candidate" | "casting" | "content-producer";

/**
 * Reflete o roteamento real do formulário do Airtable (campo "Qual a área de
 * interesse?"). Existem hoje 3 cópias desta mesma regra que precisam mudar
 * juntas se a regra mudar: aqui, em `ebmquinto-cadastro/frontend/lib/desired-position-routing.ts`
 * e em `ebmquinto-cadastro/backend/src/airtable-sync/airtable-field-mapping.ts`.
 */
export function routeDesiredPosition(
  desiredPosition: string,
): ApplicationDestination {
  if (desiredPosition === "Casting") {
    return "casting";
  }
  if (desiredPosition.startsWith("PRODUÇÃO DE CONTEÚDO")) {
    return "content-producer";
  }
  return "candidate";
}
