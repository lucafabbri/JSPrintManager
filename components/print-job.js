(function () {
    'use strict';
    angular
        .module('app')
        .directive('job', function ($http) {
            var directive = {
                scope: {
                   delete : '&',
                   job : '='
                },
                link: link,
                restrict: 'E',
                replace: true,
                templateUrl: 'components/print-job.html'
            };
            return directive;

            function link($scope, $element, $attrs) {
                if (angular.equals($scope.job, {})) {
                    $scope.job = {
                        id: new Date().getTime(),
                        contentType: -1,
                        printer: "0",
                        networkIp : "0.0.0.0",
                        networkPort : 0,
                        lptPort : "LPT1",
                        serialPort : "COM1",
                        serialBaudRate : 9600,
                        serialDataBits : 8,
                        serialParity : JSPM.Serial.Parity.None.toString(),
                        serialStopBits : JSPM.Serial.StopBits.One.toString(),
                        serialFlowControl : JSPM.Serial.Handshake.XOnXOff.toString()
                    };
                }

                $scope.printer = {};
                $scope.printer_list = [];

                $scope.$watch('job.printer', function (newValue, oldValue) {
                    if (newValue == "2") {
                        if ($scope.connected == false) {
                            $scope.printer = oldValue;
                            $("#not-connected").modal();
                        } else {
                            if ($scope.printer_list.length != 0)
                                return;
                            $scope.printer_list = ['Loading...'];
                            $scope.selected_printer = $scope.printer_list[0];
                            JSPM.JSPrintManager.getPrinters().then(function (e) {
                                $scope.printer_list = e;
                                $scope.$apply();
                            });
                        }
                    }
                    
                });
                $scope.$watch('job.contentType', function () { $scope.job.printer = "0" });

                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="tooltip"]').tooltip({
                    trigger: 'hover'
                });

                

            }
        });
})();