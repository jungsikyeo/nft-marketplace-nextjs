import client from '@libs/client/client';
import withHandler from '@libs/server/withHandler';
import { Axios } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collections = await client.collection.findMany({
    where: {
      networkId: req.body.networkId,
      account: req.body.account
    }
  });

  console.log(collections);

  return res.json({
    ok: true,
    collections
  });
}

export default withHandler('POST', handler);
