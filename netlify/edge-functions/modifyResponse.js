// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, context) => {
  console.log('**** EDGE FUNC LOGS ****')
  console.log(request)
  console.log('**** EDGE FUNC LOGS ****')
  const response = await context.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
};
