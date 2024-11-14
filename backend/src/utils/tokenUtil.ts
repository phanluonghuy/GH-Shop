/* external import */
import e from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the type for the token payload
interface TokenPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

function token({ _id, name, email, role, status }: TokenPayload): string {
  // grab specific user info to generate jwt token
  const accessToken = jwt.sign(
    {
      _id,
      name,
      email,
      role,
      status,
    },
    process.env.TOKEN_SECRET as string
  );

  return accessToken;
}

function verifyandget_id(token: string): string {
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;

  if (!decoded || !decoded._id) {
    throw new Error('Invalid token payload');
  }

  return decoded._id;
}
/* export token utility */
export default token;
export { verifyandget_id };
