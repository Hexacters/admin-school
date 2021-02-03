import { Injectable } from "@angular/core";
import * as moment from 'moment';
@Injectable({
    providedIn: 'root'
})
export class ActiveFeeService {
    public getFeeByFrequancy(data: any[]): any[] {
        const result = [];
        const monthWise = {};
        data.forEach(e => {
            if (!monthWise[e.feeType]) {
                monthWise[e.feeType] = [];
            }
            monthWise[e.feeType].push(e);
        });
        for (let key in monthWise) {
            const obj = {
                activationDate: '',
                penaltyAmount: 0,
                frequency: '',
                id: [],
                schoolName: '',
                fee: 0,
                feeType: '',
                type: '',
                typeList: [],
            }
            monthWise[key].forEach(e => {
                obj.id.push(e.id);
                obj.frequency = e.frequency,
                obj.penaltyAmount = e.penaltyAmount || 0,
                obj.activationDate = e.activationDate,
                obj.schoolName = e.schoolName;
                obj.fee += +e.fee;
                obj.feeType = e.feeType;
                obj.typeList.push(e.type);
            });
            obj.type = obj.typeList.join(', ');
            result.push(obj);
        }
        return result;
    }

    public getPanalityDays(data) {
        const a = moment();
        const b = moment(data.activationDate);
        const days = a.diff(b, 'days');
        console.log(days);
        if (days < 0) {
            return 0;
        }
        switch(data.frequency) {
            case 'Day':
                return Math.round(days);
            case 'Weekly':
                return Math.round(days/7);
            case 'Monthly':
                return Math.round(days/30);
            case 'Quartly':
                return Math.round(days/92);
            case 'Half Yearly':
                return Math.round(days/183);
            case 'Yearly':
                return Math.round(days/365);
        }
        return 0;
    }
}