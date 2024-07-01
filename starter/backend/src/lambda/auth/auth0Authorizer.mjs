import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJQqwYp8GN7ccXMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi11bDU4MmttYWsydXliYm1qLnVzLmF1dGgwLmNvbTAeFw0yNDA2Mjkw
MzE4NTNaFw0zODAzMDgwMzE4NTNaMCwxKjAoBgNVBAMTIWRldi11bDU4MmttYWsy
dXliYm1qLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMsp4TPtRFHah6Y3v2L9+akJwSB1SU+ioQ39srTr6GBAJONPoAugcVFMxnT4
Ls3qK4rWWv6K5WVEeSvuxc86HnMyTgr7Fh0WBYdqIqgBiJ4OuVwTIiyAj0IIim/A
KErowurSmYHau3iB35SIJXPHnxYbBwI0N43JdA/zSQMUNC+HGKVM368RvSJ3jSB7
cGLHiHm1yqPAHmr+N8FDYL7b52BWULocAvXaDX7IGcazdkfa3tNHREwgkfEc5x9r
GmohqgXI4HbRvfgeZNckezg4Nsf3s536mVGphBlnP4uHPpIZjuiAQwzqzfRi+CTS
t26KFLG03tw/MV+bmdRyeD1yJ80CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUHX/5RINMjkBXGmJzU1yicWelYZYwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBuQx4a5a6K9RCbIJYvuiBOTZgL434YsnQBpPWLB3B5
4duI6sgQh71HTC+hnxAOhpH8cyNk+f4AnMpXNckAY51ooBlP9qmdiaQJ/VYCblVT
T2YaPSEeyVC/+dvoMVdWbOpSVT/7h05Epj5vHNsrqdpbBDN792w5yE8ZoHkXLh6a
z9jzykIFQrcFYhavO0HeQyxGvUOMnfH1FnBd9rQL3NOZ74a9PaTzyGvIE6C4rBt4
Mt3j+qpR88M+97PKZHSBSpVSBbJW+IqyycGvQQ0S/iyPSq+S4hJLq8QBO/NheGkh
wW8kXZKx9iK/xKW7XqmzCYpuHfSxQ/fFALT/1MrVMloH
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification -> done
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
