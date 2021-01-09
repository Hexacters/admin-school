import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  constructor(private http: HttpClient) { }
  prodata;

  // Category Block
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('admin:admin'));
  }

  url = "http://testmode.aptimyst.com/interview/public/category/delete";

  getProducts(): Observable<any> {
    return this.http.get('http://testmode.aptimyst.com/interview/public/category/get')
  };

  saveCategory(category): Observable<any> {
    return this.http.post('http://testmode.aptimyst.com/interview/public/category/save', category)
  }

  deleteProduct(x): Observable<any> {
    return this.http.delete('http://testmode.aptimyst.com/interview/public/category/delete', { headers: { "ids": x } })
  }

  // Sub Category Block
  getSubCategory(): Observable<any> {
    return this.http.get('http://testmode.aptimyst.com/interview/public/sub-category/get')
  }
  savesubCategory(x, y, z): Observable<any> {
    return this.http.post('http://testmode.aptimyst.com/interview/public/sub-category/save' + '?categoryId=' + x + '&name=' + y, z)
  }

  deleteSubCategoryt(x): Observable<any> {
    return this.http.delete('http://testmode.aptimyst.com/interview/public/sub-category/delete', { headers: { "ids": x } })
  }

  // sub sub-category block
  getsubsubCategory(): Observable<any> {
    return this.http.get('http://testmode.aptimyst.com/interview/public/sub-sub-category/get')
  }
  deletesubsubCategory(x, y): Observable<any> {
    const headers = new HttpHeaders().set('ids', y).set('ids', x);
    return this.http.delete('http://testmode.aptimyst.com/interview/public/sub-category/delete', { headers: headers })
  }

// Department APIs Here =======>>>>>>>>>>>>

  getSchoolList(): Observable<any> {
    return this.http.get('/ivs/school')
  }
  saveSchool(schoolList): Observable<any> {
    let str = (schoolList.toString().split(',')).join('%2C');
    console.log(str,'str')
    return this.http.post('/ivs/school?schools='+str,{})
  }

  deleteSchool(schoolId): Observable<any> {
    return this.http.delete('/ivs/school/'+schoolId)
  }

  updateSchool(schoolId,schoolNAme): Observable<any> {
    return this.http.put('/ivs/school/'+schoolId+'?school='+schoolNAme,{})
  }


  // Department APIs Here =======>>>>>>>>>>>>
  getDepartmentList(): Observable<any> {
    return this.http.get('/ivs/department')
  }
  saveDepartment(DepartmentList): Observable<any> {
    return this.http.post('/ivs/department?departments=',DepartmentList)
  }

  deleteDepartment(DepartmentId): Observable<any> {
    return this.http.delete('/ivs/department/'+DepartmentId)
  }

  updateDepartment(id,body): Observable<any> {
    return this.http.put('/ivs/department/'+id,body)
  }

  // programm apis start here ===========>>>>>>>>>>>>
  getProgrammeList(): Observable<any> {
    return this.http.get('/ivs/program')
  }

  saveProgramme(body): Observable<any> {
    return this.http.post('/ivs/program',body)
  }

  deleteProgramme(ProgrammeId): Observable<any> {
    return this.http.delete('/ivs/program/'+ProgrammeId)
  }

  // semester apis start here ===========>>>>>>>>>>>>
  getsemesterList(): Observable<any> {
    return this.http.get('/ivs/semester')
  }
  savesemester(body): Observable<any> {
    return this.http.post('/ivs/semester',body)
  }
  deleteSemester(semesterId): Observable<any> {
    return this.http.delete('/ivs/semester/'+semesterId)
  }

  // division apis start here ===========>>>>>>>>>>>>

  getDivisionList(): Observable<any> {
    return this.http.get('/ivs/division')
  }

  deleteDivision(divisionId): Observable<any> {
    return this.http.delete('/ivs/division/'+divisionId)
  }

  saveDivision(body): Observable<any> {
    return this.http.post('/ivs/division',body)
  }

   // Type apis start here ===========>>>>>>>>>>>>

   saveFeetype(FeetypeList): Observable<any> {
    let str = (FeetypeList.toString().split(',')).join('%2C');
    console.log(str,'str')
    return this.http.post('/ivs/type?types='+str,{})
  }

  getFeetypeList(): Observable<any> {
    return this.http.get('/ivs/type')
  }

  deleteFeeType(id): Observable<any> {
    return this.http.delete('/ivs/type/'+id)
  }

  deleteType(id): Observable<any> {
    return this.http.delete('/ivs/semester/'+id)
  }


  // Type apis start here ===========>>>>>>>>>>>>

  saveFee(body): Observable<any> {
    return this.http.post('/ivs/feetype',body)
  }

  getFee(): Observable<any> {
    return this.http.get('/ivs/feetype')
  }

  deleteFee(id): Observable<any> {
    return this.http.delete('/ivs/feetype/'+id)
  }


  getLogin(userName,password): Observable<any> {
    return this.http.post('auth/signin?username='+userName+'&password='+password,{})
  }

}
