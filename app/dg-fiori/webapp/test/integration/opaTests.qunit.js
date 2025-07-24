sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'dgfiori/test/integration/FirstJourney',
		'dgfiori/test/integration/pages/FinanceList',
		'dgfiori/test/integration/pages/FinanceObjectPage'
    ],
    function(JourneyRunner, opaJourney, FinanceList, FinanceObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('dgfiori') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheFinanceList: FinanceList,
					onTheFinanceObjectPage: FinanceObjectPage
                }
            },
            opaJourney.run
        );
    }
);