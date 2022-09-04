// eslint-disable-next-line import/no-anonymous-default-export
export default async (request, context) => {
  const domain = (new URL(request.url))
  const requestOrigin = domain.protocol + '//' + domain.hostname + '/'
  console.log('**** EDGE FUNC LOGS ****')
  console.log(request)
  console.log(requestOrigin)
  console.log('**** EDGE FUNC LOGS ****')
  
  const response = await context.next();
  response.headers.set("Access-Control-Allow-Origin", "https://www.test.com");
  return response;
};
