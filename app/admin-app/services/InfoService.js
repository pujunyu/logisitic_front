(function() {
    'use strict';

    angular
        .module('admin.services')
        .service('InfoService', InfoService);

    InfoService.$inject = ['AppConfig', '$http', '$cacheFactory', '$q'];

    /* @ngInject */
    function InfoService(AppConfig, $http, $cacheFactory, $q) {
        var AppConfig = {apiUrl: '/api'}


        var stockInfoCache = $cacheFactory('stockInfo');

        var service = {
            getStockStatusMapping: getStockStatusMapping,
            getOrderStatusMapping: getOrderStatusMapping,
            getVorkasseStatusMapping: getVorkasseStatusMapping,
            getWarehouses: getWarehouses,
            getWarehouseById: getWarehouseById,
            getLogisticPaths: getLogisticPaths,
            getLogisticPathById: getLogisticPathById,
            getExtraServices: getExtraServices,
            uploadImage: uploadImage,
        };
        return service;

        function getStockStatusMapping (statusId) {
            statusId = parseInt(statusId)
            var statusMapping = ['删除','未知','已登记到货','待入库','','已入库','库存问题件','移库未确认','移库已确认','移库处理中','移库问题件','移库完成','申请发货','发货处理中','已发货'];
            if(statusId===undefined){
                return statusMapping;
            }
            statusId = statusId + 1;
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        function getOrderStatusMapping (statusId) {
            statusId = parseInt(statusId)
            var statusMapping = ['删除','未知','未处理','待付款','已付款','待发货','已发货','订单问题件','打包配货中'];
            if(statusId===undefined){
                return statusMapping;
            }
            statusId = statusId + 1;
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        
        function getVorkasseStatusMapping (statusId) {
            statusId = parseInt(statusId)
            statusId = statusId + 1;
            var statusMapping = ['删除','未知','未处理','处理中','代刷成功','申请拒绝'];
            if(statusId<statusMapping.length){
                return statusMapping[statusId];
            }
            return statusMapping[0];
        }
        function getWarehouses() {
            if(stockInfoCache.get('warehouses')){
                return stockInfoCache.get('warehouses');
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/warehouses').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('warehouses', promise)
            return promise;
        }

        function getWarehouseById (id) {
           return getWarehouses().then(function(whs) {
                var wh = whs.filter(function (item) {
                    return parseInt(item.id) === parseInt(id);
                });
                return angular.isArray(wh)&&wh.length>0 ? wh[0] : null;
           });
        }

        function getLogisticPaths(type) {
            if(stockInfoCache.get('logisticPaths')){
                return stockInfoCache.get('logisticPaths').then(function(data){
                    if(angular.isArray(data)){
                        if(parseInt(type)===0){
                            return data;
                        }
                        else{
                            var data = data.filter(function(value){
                                return parseInt(value.type) === type;
                            });
                        }
                    }
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/logistic-paths').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('logisticPaths', promise);

            promise = promise.then(function(data) {
                if(angular.isArray(data)){
                    if(parseInt(type)===0){
                        return data;
                    }
                    else{
                        var data = data.filter(function(value){
                            return parseInt(value.type) === type;
                        });
                    }
                }
                return data;
            });
            return promise;
        }

        function getLogisticPathById (id, type) {
           return getLogisticPaths(type).then(function(lps) {
                if(angular.isArray(lps)){
                    var lp = lps.filter(function (item) {
                        return parseInt(item.id) === parseInt(id);
                    });
                }
                return angular.isArray(lp)&&lp.length>0 ? lp[0] : null;
           });
        }

        // type: 0=全部 1=入库, 2=移库, 3=发货, 4=带刷
        // user_group: 0=all, 1=vip only
        function getExtraServices(type, userGroup) {
            if(stockInfoCache.get('extraServices')){
                return stockInfoCache.get('extraServices').then(function(data){
                    if(angular.isArray(data)){
                        var data = data.filter(function(value){
                            return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                        });
                    }
                    return data;
                });
            }
            var promise = $http.get(AppConfig.apiUrl + '/info/extra-services').then(function (response) {
                return response.data;
            });
            stockInfoCache.put('extraServices', promise);

            promise = promise.then(function(data) {
                if(angular.isArray(data)){
                    data = data.filter(function(value){
                        return parseInt(value.type) === parseInt(type) && parseInt(value.user_group) === parseInt(userGroup) ;
                    });
                }
                return data;
            });
            return promise;
        }

        function uploadImage (image) {
            var fd = new FormData();
            fd.append('image', image);
            var promise = $http.post(AppConfig.apiUrl + '/image/', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response){
                return response.data;
            });
            return promise;
        }

    }
})();