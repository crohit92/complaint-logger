global[Symbol.for('OpenEndpoints')] = [];
export const OpenEndpoints: string[] = global[Symbol.for('OpenEndpoints')];
export function OpenEndpoint(endpoint: string) {
  OpenEndpoints.push(endpoint);
  return endpoint;
}
