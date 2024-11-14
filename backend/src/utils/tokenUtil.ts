/* external import */
import jwt from 'jsonwebtoken';

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

/* export token utility */
export default token;
