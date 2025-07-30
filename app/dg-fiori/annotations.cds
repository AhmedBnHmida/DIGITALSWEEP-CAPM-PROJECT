using Financeservice as service from '../../srv/service';
annotate service.Finance with @(


/*************************************************************************************************** */
// === Header Info Annotation ===


    UI.HeaderInfo: {
        TypeName: 'Finance',
        TypeNamePlural: 'Finance',
        Title: { Value: No },
        Description: { Value: Segment },
        //ImageUrl:  '~/images/avatar.png' , //full absolute or relative URL as a string
        ImageUrl : 'data:image/png;base64,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',
        //ImageUrl : 'data:image/png;base64,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',
    },
    

/*************************************************************************************************** */
// === UI Facet & FieldGroup Definition (Details Page Layout) ===


    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'No',
                Value : No,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Segment',
                Value : Segment,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Country',
                Value : Country,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Product',
                Value : Product,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Discount_Band',
                Value : Discount_Band,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Units_Sold',
                Value : Units_Sold,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Manufacturing_Price',
                Value : Manufacturing_Price,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Sale_Price',
                Value : Sale_Price,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Gross_Sales',
                Value : Gross_Sales,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Discounts',
                Value : Discounts,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Sales',
                Value : Sales,
            },
            {
                $Type : 'UI.DataField',
                Label : 'COGS',
                Value : COGS,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Profit',
                Value : Profit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Date',
                Value : Date,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Month_Number',
                Value : Month_Number,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Month_Name',
                Value : Month_Name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Year',
                Value : Year,
            },

        ],
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],


/*************************************************************************************************** */
// === Line Item Table View  ===


    UI.LineItem #SOTable: [
        {
            $Type : 'UI.DataField',
            Label : 'No',
            Value : No,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Segment',
            Value : Segment,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Product',
            Value : Product,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Country',
            Value : Country,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Units_Sold',
            Value : Units_Sold,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Units_Sold',
            Value : Units_Sold,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Manufacturing_Price',
            Value : Manufacturing_Price,
        },
        {
        $Type : 'UI.DataField',
            Label : 'Sale_Price',
            Value : Sale_Price,
        }

    ],


/*************************************************************************************************** */
// === Chart Definition  ===

    UI.Chart #ROChart: {
        $Type: 'UI.ChartDefinitionType',
        ChartType: #Column,
        Measures: ['Sales','Profit'],
        Dimensions: ['Country','Segment'],
        Title : 'Finance Report',
        DynamicMeasures : ['@Analytics.AggregatedProperty#sales_sum','@Analytics.AggregatedProperty#profit_sum'],
    },    


/*************************************************************************************************** */
// === Aggregated Properties for Chart Dynamic Measures ===


    Analytics.AggregatedProperty #sales_sum : 
    {
        $Type : 'Analytics.AggregatedPropertyType',
        Name : 'sales_sum',
        AggregatableProperty : Sales,
        AggregationMethod :'sum',
        @Common.Label : 'Sales Sum'
    },

    Analytics.AggregatedProperty #profit_sum:
    {
        $Type:'Analytics.AggregatedPropertyType',
        Name:'profit_sum',
        AggregatableProperty:Profit,
        AggregationMethod:'sum',
        @Common.Label:'Profit Sum'
    },


/*************************************************************************************************** */
// === New UI annotations defining multiple views (table & chart) ===


    UI.SelectionPresentationVariant #SPVSOTable  : {
            $Type              : 'UI.SelectionPresentationVariantType',
            Text               : 'Table View',
            SelectionVariant   : {
                $Type        : 'UI.SelectionVariantType',
                Text         : 'Table View',
                // This is the default filter (can be adjusted based on requirement)
                /*SelectOptions: [{
                    $Type       : 'UI.SelectOptionType',
                    PropertyName: No,
                    Ranges      : [{
                        $Type : 'UI.SelectionRangeType',
                        Sign  : #I,
                        Option: #NE,
                        Low   : 'No'
                    } ],
                } ],*/
            },
            PresentationVariant: {
                $Type         : 'UI.PresentationVariantType',
                Visualizations: ['@UI.LineItem#SOTable']
            }
    },
    UI.SelectionPresentationVariant #SPVROChart  : {
            $Type              : 'UI.SelectionPresentationVariantType',
            Text               : 'Chart View',
            SelectionVariant   : {
                $Type        : 'UI.SelectionVariantType',
                Text         : 'Chart View',
                // This is the default filter (can be adjusted based on requirement)
                /*SelectOptions: [{
                    $Type       : 'UI.SelectOptionType',
                    PropertyName: No,
                    Ranges      : [{
                        $Type : 'UI.SelectionRangeType',
                        Sign  : #I,
                        Option: #EQ,
                        Low   : 'No'
                    } ]
                } ]*/
            },
            PresentationVariant: {
                $Type         : 'UI.PresentationVariantType',
                Visualizations: ['@UI.Chart#ROChart']
            }
    },


/*************************************************************************************************** */
// === UI annotations for search fields (SelectionFields) ===


    UI.SelectionFields  : [
        Segment,
        //Product,
        Country,
        Date,
        Month_Number
    ],


/*************************************************************************************************** */
// === SelectionPresentationVariant for the Sales view ===



    UI.LineItem #SalesTable: [
        {
            $Type : 'UI.DataField',
            Label : 'No',
            Value : No
        },
        {
            $Type : 'UI.DataField',
            Label : 'Segment',
            Value : Segment,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Product',
            Value : Product,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Country',
            Value : Country
        },
        {
            $Type : 'UI.DataField',
            Label : 'Sales',
            Value : Sales
        }
    ],

    UI.SelectionPresentationVariant #SelPreVarRO: {
        $Type              : 'UI.SelectionPresentationVariantType',
        Text               : 'Sales Grouped by country',
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            Text         : 'Sales Grouped by country',
            SelectOptions: [{
                $Type       : 'UI.SelectOptionType',
                PropertyName: No,
                Ranges      : [{
                    $Type : 'UI.SelectionRangeType',
                    Sign  : #I,
                    Option: #EQ,
                    Low   : 'No'
                }]
            }]
        },
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem#SalesTable'],
            SortOrder     : [{
                $Type     : 'Common.SortOrderType',
                Property  : No,
                Descending: false
            }],
            GroupBy       : [Country]
        }
    },



/*************************************************************************************************** */
// === ... ===
/*
    FilterRestrictions : {
        $Type              : 'Capabilities.FilterRestrictionsType',
        RequiredProperties : [ Date ],
        FilterExpressionRestrictions : [
            {
                $Type : 'Capabilities.FilterExpressionRestrictionType',
                Property : Date,
                
            }
        ]
    }
*/
);

annotate service.Finance with {
    Month_Number @(
        Common.Label : '{i18n>MouthNumber}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'MouthNumber',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Month_Number,
                    ValueListProperty : 'number',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : Month_Name,
    )
};

annotate service.Finance with {
    Date @Common.Label : 'Date';
};

