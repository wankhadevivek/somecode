export class expense{
    success?:boolean
    data?: expenseresult;
    has_next?: boolean;
    page_count?: string;
    previous_page?: string;
    next_page?: boolean;
  }
  
  export interface expenseresult{
      workshop_id?:string,
      invoice_no?:string,
      invoice_date?:string,
      customer_name?:string,
      customer_mobile?:string,
      total_amount?:string,
      discount?:string,
      final_amount?:string,
      paid?:string,
      balance?:string,
      sgst?:string,
      cgst?:string,
      igst?:string,
      total_gst?:string,
      settings?:string,
      exit_note?:string,
      created_at?:string,
      updated_at?:string,
      counter_items?:string,
      is_delete?:string,
      taxable?:string,
      discount_amount?:string,
      payment_method?:string,
      recived_type?:string,
      recevied_date?:string,
      return_amount?:string,
      return_date?:string,
      counter_cus_id?:string,
      refund_amount?: string,
      is_return?: string,
      supplier_name?:string,
      paid_amount?:string,
      date?:string,
      category_name:string,
      bill_no?:string,
      balance_amount?:string,
      id?:string,
  }