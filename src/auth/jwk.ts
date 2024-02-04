import { JwtAlgorithm, decode, verify } from '@tsndr/cloudflare-worker-jwt';

const jwksCache = {} as Record<string, JsonWebKeyWithKid>;
type FetchJwksResponse = {
	keys: JsonWebKeyWithKid[];
};

export const verifyJwt = async (token: string, clientIds: string[]) => {
	const decoded = decode(token);
	const header = decoded.header as { kid?: string; alg?: JwtAlgorithm } | undefined;
	if (!header?.kid) throw new Error('Missing "kid" in token header. Cannot verify token');

	if (!decoded.payload?.aud) throw new Error('Missing aud in JWT. Cannot verify token');
	const tokenAudience = Array.isArray(decoded.payload.aud) ? decoded.payload.aud : [decoded.payload.aud];

	if (!tokenAudience.some((aud) => clientIds.includes(aud))) throw new Error('Unknown aud in JWT. Token does not belong to this app');

	if (Object.keys(jwksCache).length === 0) {
		await getKeys('https://www.googleapis.com/oauth2/v3/certs');
	}

	const jwk = jwksCache[header.kid];
	if (!jwk) throw new Error(`Unknown kid ${header}`);

	return verify(token, jwk, header.alg ?? 'HS256');
};

async function getKeys(jwksEndpoint: string) {
	const response = await fetch(jwksEndpoint);
	if (!response.ok) {
		throw new Error(`Cannot fetch JWKs from ${jwksEndpoint}`);
	}

	const jwks = (await response.json()) as FetchJwksResponse;
	if (!('keys' in jwks)) {
		throw new Error(`Invalid JWKs response from ${jwksEndpoint}`);
	}

	for (let key of jwks.keys) {
		jwksCache[key.kid] = key;
	}
}
