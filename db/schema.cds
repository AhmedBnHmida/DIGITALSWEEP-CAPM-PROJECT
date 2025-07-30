namespace myFinance;


@Aggregation.ApplySupported: {

    PropertyRestrictions: false,
    GroupableProperties: [
        'Country',
        'Segment',
    ],
    
    AggregatableProperties: 
    [
        { Property: 'Sales' },
        { Property: 'Profit' }
    ]
}



entity Finance @(odata.draft.enabled) { 

    key No:Integer;
    Segment:String;
    Country:String;
    Product:String; 	 
    Discount_Band:String; 	 
    Units_Sold:Decimal(10,2);
    Manufacturing_Price:Decimal(10,2); 	
    Sale_Price:Decimal(10,2);	
    Gross_Sales:Decimal(10,2);
    Discounts:Decimal(10,2);	 
    Sales:Decimal(10,2);
    COGS:Decimal(10,2);	
    Profit:Decimal(10,2);	
    Date:Date;
    Month_Number:Integer;
    Month_Name:String; 	
    Year:Integer
}

entity  MouthNumber {

    key number:Integer;

}