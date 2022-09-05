// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, context) => {
  const domain = (new URL(request.url))
  const requestOrigin = domain.origin
  console.log('**** EDGE FUNC LOGS ****')
  console.log(request)
  console.log(requestOrigin)
  console.log('**** EDGE FUNC LOGS ****')
  
  const response = await context.next();
  response.headers.set("Access-Control-Allow-Origin", requestOrigin);
  return response;
};
