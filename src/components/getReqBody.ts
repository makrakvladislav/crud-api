const getReqBody = async (req: any) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req
        .on('data', (chunk: string) => {
          body += chunk.toString();
        })
        .on('end', () => {
          resolve(JSON.parse(body));
        });
    } catch (err) {}
  });
};

export default getReqBody;
