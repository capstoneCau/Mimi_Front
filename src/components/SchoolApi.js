export function SearchSchool(_schoolName) {
  const requestParam = {
    apiKEY: '552ae097bbb6071ec73f76c56c6a5543',
    schoolName: _schoolName,
  };

  return fetch(
    `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${requestParam.apiKEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&searchSchulNm=${requestParam.schoolName}`,
  );
}
