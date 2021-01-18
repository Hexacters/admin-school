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
        console.log(str, 'str')
        return this.http.post('/ivs/school?schools=' + str, {})
    }

    deleteSchool(schoolId): Observable<any> {
        return this.http.delete('/ivs/school/' + schoolId)
    }

    updateSchool(schoolId, schoolNAme): Observable<any> {
        return this.http.put('/ivs/school/' + schoolId + '?school=' + schoolNAme, {})
    }


    // Department APIs Here =======>>>>>>>>>>>>
    getDepartmentList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/department/byschool', {params});
        }
        return this.http.get('/ivs/department');
    }

    saveDepartment(DepartmentList): Observable<any> {
        return this.http.post('/ivs/department', DepartmentList)
    }

    deleteDepartment(DepartmentId): Observable<any> {
        return this.http.delete('/ivs/department/' + DepartmentId)
    }

    updateDepartment(id, body): Observable<any> {
        return this.http.put('/ivs/department/' + id, body)
    }

    // programm apis start here ===========>>>>>>>>>>>>
    getProgrammeList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/program/bydepartment', {params})
        }
        return this.http.get('/ivs/program')
    }

    saveProgramme(body): Observable<any> {
        return this.http.post('/ivs/program', body)
    }

    updateProgramme(id, body): Observable<any> {
        return this.http.put(`/ivs/program/${id}`, body)
    }

    deleteProgramme(ProgrammeId): Observable<any> {
        return this.http.delete('/ivs/program/' + ProgrammeId)
    }

    // semester apis start here ===========>>>>>>>>>>>>
    getsemesterList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/semester/byprogram', {params})
        }
        return this.http.get('/ivs/semester')
    }

    savesemester(body): Observable<any> {
        return this.http.post('/ivs/semester', body)
    }

    updateSemester(id, body): Observable<any> {
        return this.http.put(`/ivs/semester/${id}`, body)
    }

    deleteSemester(semesterId): Observable<any> {
        return this.http.delete('/ivs/semester/' + semesterId)
    }

    // division apis start here ===========>>>>>>>>>>>>

    getDivisionList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/division/byDivision', {params})
        }
        return this.http.get('/ivs/division')
    }

    deleteDivision(divisionId): Observable<any> {
        return this.http.delete('/ivs/division/' + divisionId)
    }

    saveDivision(body): Observable<any> {
        return this.http.post('/ivs/division', body)
    }

    updateDivision(id, body): Observable<any> {
        return this.http.put(`/ivs/division/${id}`, body)
    }

    // Type apis start here ===========>>>>>>>>>>>>

    saveFeetype(FeetypeList): Observable<any> {
        let str = (FeetypeList.toString().split(',')).join('%2C');
        console.log(str, 'str')
        return this.http.post('/ivs/type?types=' + str, {})
    }

    updateFeetype(id, typeName): Observable<any> {
        return this.http.put('/ivs/type/' + id + '?type=' + typeName, {})
    }

    getFeetypeList(): Observable<any> {
        return this.http.get('/ivs/type')
    }

    deleteFeeType(id): Observable<any> {
        return this.http.delete('/ivs/type/' + id)
    }

    getFeeCalculation(params?): Observable<any> {
        return this.http.get('/ivs/feetype/calculatestudentsfee', {params});
    }

    getFeeCalculationByID(params?): Observable<any> {
        return this.http.get('/ivs/feetype/calculatefee', {params});
    }

    updateFeeCalculation(params): Observable<any> {
        return this.http.put('/ivs/feetype/editcalculatefee', params);
    }

    // Type apis start here ===========>>>>>>>>>>>>

    saveFee(body): Observable<any> {
        return this.http.post('/ivs/feetype', body)
    }

    updateFee(id, body): Observable<any> {
        return this.http.put(`/ivs/feetype/${id}`, body)
    }

    getFee(): Observable<any> {
        return this.http.get('/ivs/feetype')
    }

    deleteFee(id): Observable<any> {
        return this.http.delete('/ivs/feetype/' + id)
    }


    // Scholarship apis start here ===========>>>>>>>>>>>>

    saveScholarship(body): Observable<any> {
        return this.http.post('/ivs/scholarship/saveScholarship', body)
    }

    updateScholarship(id, body): Observable<any> {
        return this.http.put(`/ivs/scholarship/${id}`, body)
    }

    getScholarship(): Observable<any> {
        return this.http.get('/ivs/scholarship/getScholarship');
    }

    getScholarshipByStudent(params?): Observable<any> {
        return this.http.get('/ivs/scholarship/bystudent', {params});
    }

    deleteScholarship(id): Observable<any> {
        return this.http.delete('/ivs/scholarship/' + id);
    }

    // Student apis start here ===========>>>>>>>>>>>>

    saveStudent(body): Observable<any> {
        return this.http.post('/ivs/student/saveStudent', body)
    }

    updateStudent(id, body): Observable<any> {
        return this.http.put(`/ivs/student/updateStudent/${id}`, body)
    }

    getStudent(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/student/byStudent', {params})
        }
        return this.http.get('/ivs/student/getStudent');
    }

    deleteStudent(id): Observable<any> {
        return this.http.delete('/ivs/student/deleteStudent/' + id);
    }

    // Assign Scholarship apis start here ===========>>>>>>>>>>>>

    saveAssignScholarship(body): Observable<any> {
        return this.http.post('/ivs/assignScholarship/saveAssignScholarship', body)
    }

    updateAssignScholarship(id, body): Observable<any> {
        return this.http.put(`/ivs/assignScholarship/${id}`, body)
    }

    getAssignScholarship(): Observable<any> {
        return this.http.get('/ivs/assignScholarship/getAssignScholarship');
    }

    deleteAssignScholarship(id): Observable<any> {
        return this.http.delete('/ivs/assignScholarship/' + id);
    }

     // Penalty apis start here ===========>>>>>>>>>>>>

    savePenalty(body): Observable<any> {
        return this.http.post('/ivs/penalty/savePenalty', body)
    }

    updatePenalty(id, body): Observable<any> {
        return this.http.put(`/ivs/penalty/deletePenalty/${id}`, body)
    }

    getPenalty(): Observable<any> {
        return this.http.get('/ivs/penalty/getPenalty');
    }

    deletePenalty(id): Observable<any> {
        return this.http.delete('/ivs/penalty/updatePenalty/' + id);
    }

    // Penalty apis start here ===========>>>>>>>>>>>>

    saveAdmin(body): Observable<any> {
        return this.http.post('/ivs/admin', body)
    }

    updateAdmin(id, body): Observable<any> {
        return this.http.put(`/ivs/admin/${id}`, body)
    }

    getAdmin(): Observable<any> {
        return this.http.get('/ivs/admin');
    }

    deleteAdmin(id): Observable<any> {
        return this.http.delete('/ivs/admin/' + id);
    }

    // Login API

    getLogin(userName, password): Observable<any> {
        return this.http.post('auth/signin?username=' + userName + '&password=' + password, {})
    }

}
