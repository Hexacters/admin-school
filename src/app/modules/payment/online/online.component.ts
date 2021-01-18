import { Component, OnInit } from '@angular/core';
import { WindowRefService } from 'src/app/service/window-ref.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.scss'],
  providers: [WindowRefService]
})
export class OnlineComponent implements OnInit {

  constructor(private window: WindowRefService) { }

  ngOnInit() {
    //this.payWithRazor();
  }

  payWithRazor(val=11) {
    const options: any = {
      key: 'rzp_live_WiOJxc1xjTYpRx',
      amount: 50000, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: '', // company name or product name
      description: '',  // product description
      image: '', // company logo or product image
      order_id: 'order_GPgaDT83tTQ9HY', // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.window.nativeWindow.Razorpay(options);
    rzp.open();
  }

}
