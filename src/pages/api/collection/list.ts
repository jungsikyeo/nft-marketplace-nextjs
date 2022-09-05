import client from '@prisma/client';
import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collection = await client.collection.findMany({
    where: {
      account: req.body.account,
      networkId: req.body.netrworkId
    }
  });
  console.log(collection);
  return res.json({
    ok: true,
    collection
  });
}

export default withHandler('POST', handler);
