import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.status(200).end();
}

export default withHandler('POST', handler);
