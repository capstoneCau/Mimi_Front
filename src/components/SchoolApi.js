export function SearchSchool(_schoolName) {
  const requestParam = {
    apiKEY: '7aa0e0e9a7762e8a8e4aeb2dd3e61a5e',
    schoolName: _schoolName,
  };

  return fetch(
    `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${requestParam.apiKEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&searchSchulNm=${requestParam.schoolName}`,
  );
}
