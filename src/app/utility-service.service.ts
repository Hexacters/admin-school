import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilityServiceService {

    constructor(private http: HttpClient) { }
    prodata;

    public currentUniversity(): number {
        const data = JSON.parse(localStorage.getItem('userDetails') || '{}') || {};
        if (!data) {
            return 0;
        }
        return data.universityId;
    }

    public isSuperAdmin(): boolean {
        const data = JSON.parse(localStorage.getItem('userDetails') || '{}') || {};
        if (!data) {
            return false;
        }
        return data.role === 'superAdmin';
    }

    public get isAdmin(): boolean {
        const data = JSON.parse(localStorage.getItem('userDetails') || '{}') || {};
        if (!data) {
            return false;
        }
        return data.role === 'superAdmin' || data.role === 'admin';
    }

    public isNodivisionSem(data: any[], id) {
        const res = data.find(e => e.id == id);
        return res && res.divisionAddition;
    }

    // University APIs Here =======>>>>>>>>>>>>

    getUniversityList(): Observable<any> {
        return this.http.get('/ivs/university')
    }
    saveUniversity(schoolList): Observable<any> {
        let str = (schoolList.toString().split(',')).join('%2C');
        console.log(str, 'str')
        return this.http.post('/ivs/university?universitys=' + str, {})
    }

    deleteUniversity(schoolId): Observable<any> {
        return this.http.delete('/ivs/university/' + schoolId)
    }

    updateUniversity(schoolId, schoolNAme): Observable<any> {
        return this.http.put('/ivs/university/' + schoolId + '?university=' + schoolNAme, {})
    }


    // School APIs Here =======>>>>>>>>>>>>

    getSchoolList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/school/byschool', {params});
        }
        return this.http.get('/ivs/school')
    }

    saveSchool(schoolList): Observable<any> {
        return this.http.post('/ivs/school', schoolList)
    }

    deleteSchool(schoolId): Observable<any> {
        return this.http.delete('/ivs/school/' + schoolId)
    }

    updateSchool(schoolId, data): Observable<any> {
        return this.http.put('/ivs/school/' + schoolId, data)
    }


    // Department APIs Here =======>>>>>>>>>>>>
    getDepartmentList(params?, byData?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/department/byschool', {params});
        }
        if (byData) {
            return this.http.get('/ivs/department', {params: byData});
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
    getProgrammeList(params?, byUniversity?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/program/bydepartment', {params})
        }

        if (byUniversity) {
            return this.http.get('/ivs/program', {params: byUniversity})
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
    getsemesterList(params?, byUniversity?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/semester/byprogram', {params})
        }
        if (byUniversity) {
            return this.http.get('/ivs/semester', {params: byUniversity})
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

    getDivisionList(params?, byUniversity?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/division/byDivision', {params})
        }
        return this.http.get('/ivs/division', {params: byUniversity})
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

    saveFeetype(FeetypeList, universityId): Observable<any> {
        let str = (FeetypeList.toString().split(',')).join('%2C');
        console.log(str, 'str')
        return this.http.post('/ivs/type?universityId=' + universityId + '&types=' + str, {})
    }

    updateFeetype(id, typeName, universityId): Observable<any> {
        return this.http.put('/ivs/type/' + id + '?universityId=' + universityId + '&type=' + typeName, {})
    }

    getFeetypeList(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/type', {params})
        }
        return this.http.get('/ivs/type')
    }

    deleteFeeType(id): Observable<any> {
        return this.http.delete('/ivs/type/' + id)
    }

    getFeeCalculation(params?): Observable<any> {
        return this.http.get('/ivs/feetype/calculatestudentsfee', {params});
    }

    updatePriceCalculation(params?): Observable<any> {
        return this.http.get('/ivs/feetype/updateFeeByDivision', {params});
    }

    getFeeCalculationByID(params?): Observable<any> {
        return this.http.get('/ivs/feetype/calculatefee', {params});
    }

    getFeeBreakup(params?): Observable<any> {
        return this.http.get('/ivs/feetype/feebreakup', {params});
    }

    updateScholarPriceCalculation(params?): Observable<any> {
        return this.http.get('/ivs/feetype/studentscholarshipupdate', {params});
    }

    updateFeeCalculation(params): Observable<any> {
        return this.http.put('/ivs/feetype/editcalculatefee', params);
    }

    // Active Fee apis start here ===========>>>>>>>>>>>>

    getActiveFee(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/activatefee', {params});
        }
        return this.http.get('/ivs/activatefee');
    }

    addActiveFee(params): Observable<any> {
        return this.http.post('/ivs/activatefee', params);
    }

    getTerms(params): Observable<any> {
        return this.http.get('/ivs/activatefee/term', {params});
    }

    // Type apis start here ===========>>>>>>>>>>>>

    saveFee(body): Observable<any> {
        return this.http.post('/ivs/feetype', body)
    }

    updateFee(id, body): Observable<any> {
        return this.http.put(`/ivs/feetype/${id}`, body)
    }

    getFee(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/feetype', {params})
        }
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

    getScholarship(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/scholarship/getScholarship', {params});
        }
        return this.http.get('/ivs/scholarship/getScholarship');
    }

    getScholarshipByStudent(params?): Observable<any> {
        return this.http.get('/ivs/scholarship/bystudent', {params});
    }

    getScholarshipBreakUp(params?): Observable<any> {
        return this.http.get('/ivs/scholarship/breakup', {params});
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

    getStudent(params?, byUniversity?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/student/byStudent', {params})
        }
        if (byUniversity) {
            return  this.http.get('/ivs/student/getStudent', {params: byUniversity});
        }
        return this.http.get('/ivs/student/getStudent');
    }

    getStudentById(id: number): Observable<any> {
        return this.http.get('/ivs/student/details/' + id);
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

    getAssignScholarship(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/assignScholarship/getAssignScholarship', {params});
        }
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
        return this.http.put(`/ivs/penalty/updatePenalty/${id}`, body)
    }

    getPenalty(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/penalty/getPenalty', {params});
        }
        return this.http.get('/ivs/penalty/getPenalty');
    }

    deletePenalty(id): Observable<any> {
        return this.http.delete('/ivs/penalty/deletePenalty/' + id);
    }

    // Penalty apis start here ===========>>>>>>>>>>>>

    saveAdmin(body): Observable<any> {
        return this.http.post('/ivs/admin', body)
    }

    updateAdmin(id, body): Observable<any> {
        return this.http.put(`/ivs/admin/${id}`, body)
    }

    getAdmin(params?): Observable<any> {
        if (params) {
            return this.http.get('/ivs/admin', {params});
        }
        return this.http.get('/ivs/admin');
    }

    deleteAdmin(id): Observable<any> {
        return this.http.delete('/ivs/admin/' + id);
    }

    forgotPassword(params): Observable<any> {
        return this.http.get('/ivs/admin/forgotpassword', {params});
    }

    resetPassword(params): Observable<any> {
        return this.http.put('/ivs/admin/resetPassword', null, {params});
    }

    // Login API

    getLogin(userName, password): Observable<any> {
        return this.http.post('auth/signin?username=' + userName + '&password=' + password, {})
    }

    // Payment API

    getPaymentStatus(params): Observable<any> {
        return this.http.get('/ivs/paymentstatus', {params})
    }

    getPaymentStatusByStudent(params): Observable<any> {
        return this.http.get('/ivs/paymentstatus/paymentstatusbystudent', {params})
    }

    offlinePayment(params): Observable<any> {
        return this.http.post('/ivs/offlinepayment', params);
    }

    setOnlinePaymentOrder(params): Observable<any> {
        return this.http.get('/ivs/payment', {params, responseType: 'text'},);
    }

    onlinePayment(params): Observable<any> {
        return this.http.post('/ivs/payment/confirmstatus', params);
    }

    // Notification API
    getNotification(params?): Observable<any>{
        if (params) {
            return this.http.get('/ivs/notification/activatefee', {params});
        }
        return this.http.get('/ivs/notification/activatefee');
    }

    // Dashboard API

    getDashBoardCount(params?): Observable<any>{
        if (params) {
            return this.http.get('dashboard/count', {params});
        }
        return this.http.get('dashboard/count');
    }

    getDashBoardPaymentMode(params?): Observable<any>{
        if (params) {
            return this.http.get('dashboard/paymentmode', {params});
        }
        return this.http.get('dashboard/paymentmode');
    }

    getDashBoardMonthly(params?): Observable<any>{
        if (params) {
            return this.http.get('dashboard/monthlyfee', {params});
        }
        return this.http.get('dashboard/monthlyfee');
    }

    getDashBoardPrograms(params?): Observable<any>{
        if (params) {
            return this.http.get('dashboard/topsevenfeesbyprograms', {params});
        }
        return this.http.get('dashboard/topsevenfeesbyprograms');
    }

    getDashBoardTopTypes(params?): Observable<any>{
        if (params) {
            return this.http.get('dashboard/topsevenfeetypes', {params});
        }
        return this.http.get('dashboard/topsevenfeetypes');
    }

    getReportStudent(params): Observable<any>{
        return this.http.get('report/studentreport', {params});
    }

    getReportFeeStatus(params?): Observable<any>{
        if (params) {
            return this.http.get('report/feestatus', {params});
        }
        return this.http.get('report/feestatus', {params});
    }

    getReportPaymentStatus(params?): Observable<any>{
        if (params) {
            return this.http.get('report/paymentstatus', {params});
        }
        return this.http.get('report/paymentstatus');
    }

}
