/**
 * 技术市场接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {

    console.log(httpUrl.baseMarketUrl)
    return {
        // 技术成果列表查询
        tech_achi_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/pageProjectBaseInfo', param);
        },

        // 技术需求列表查询
        tech_require_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/pageDemandBaseInfo', param);
        },
        //查询技术成果需求信息
        queryDetails: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/queryDetails?id=' + param.id, param);
        },
        // 需求详情
        listZMDemand: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/queryDetails?id=' + param.id, param);
        },

        // /zMDemandRest/
        // 查询技术成果需求信息
        // 技术需求列表查询
        tech_manager_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/pageZMTechBroker', param);
        },


        // 查询检索列表

        // dictionary_type_list: function (param) {
        //     return Http.post(httpUrl.baseMarketUrl + '/zSDictTypeValRest/listMultiZSDictTypeVal', param);
        // },


        // 投资机构分页查询列表

        pageInvestmentInfo: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMInvestmentRest/pageInvestmentBaseInfo', param);
        },

        //查询投资机构信息
        queryInvestmentDetails: function (id) {
            return Http.post(httpUrl.baseMarketUrl + '/zMInvestmentRest/queryDetails?id=' + id);
        },

        // 技术经纪人分页查询

        pageZMTechBroker: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/pageZMTechBroker', param);
        },
        // 服务机构分页查询

        pageZMTechOrgan: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechOrganRest/pageZMTechOrganBaseInfo', param);
        },

        //查询服务机构详情
        queryTechOrganDetail: function (id) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechOrganRest/queryDetails?id=' + id);
        },


        sendTechnicalResultToInvestOrg: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/sendTechnicalResultToInvestOrg?requestItemId=' + param.requestItemId + "&requestCarryId=" + param.requestCarryId, param);
        },


        //技术成果发送邀约交流
        sendInvitationsCommunicate: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/sendInvitationsCommunicate?requestItemId=' + param.requestItemId, param);
            //return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/sendTechnicalManagerZMRequest?requestItemId='+param.requestItemId, param);
        },


        //邀约交流/委托需求/委托成果 通用接口，
        //通过requestType申请类型区分:向经纪人发起“投递”技术成果业务（委托成果）1 向经纪人发起“委托经纪人”寻找技术成果需求业务(委托需求) 2 向经纪人发起“邀约”业务 3
        sendTechnicalManagerZMRequest: function (param) {
            var url = "requestCarryId=" + param.requestCarryId + "&requestItemId=" + param.requestItemId + "&requestType=" + param.requestType;
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/sendTechnicalManagerZMRequest?' + url, param);
        },
        //技术需求发送投递成果
        sendTechnicalResult: function (param) {
            var url = "requestCarryId=" + param.requestCarryId + "&requestItemId=" + param.requestItemId + "&requestType=" + param.requestType;
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/sendTechnicalResult?' + url, param);
        },
        //技术成果丶技术需求丶技术经纪人丶技术转移机构数量统计
        resourceStatistics: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMStatisticsRest/resourceStatistics', param);
        },
        // 查询技术成果分类字典
        dictionary_type_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zSDictTypeValRest/listMultiZSDictTypeVal', param);
        },
        // 查询标签
        query_tag_list: function (code) {
            return Http.get(httpUrl.baseMarketUrl + '/zMTagRest/listTagTree/' + code);
        },
        //////////////////////////////////////////////////////
        //查询技术成果信息
        listZMProject: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/queryDetails?id=' + param.id, param);
        },

        //////////////////////////////////////////////////////


        // 查询技术成果分类字典
        province_city_list: function (param) {
            return Http.post(httpUrl.baseUrl + '/dict/select', param);
        },

        //新增技术成果
        save_technology_results: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/saveZMProject', param);
        },


        // 个人中心技术成果 分页查询
        find_technology_pages: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/pageMyProjectInfo', param);
        },

        // 个人中心技术需求 分页查询
        find_technology_require_pages: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/pageDemandBaseInfo', param);
        },


        //新增技术需求
        save_technology_require_results: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/saveZMDemand', param);
        },

        //通过参数技术经纪人基础信息列表提供字典解析
        selectPageZMTechBrokerVOTrans: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/selectPageZMTechBrokerVOTrans', param);

        },

        listZMTechBrokerByVO: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/queryDetails?id=' + param.id, param);

        },

        findZMFavoriteExistsByVO: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMFavoriteRest/findZMFavoriteExistsByVO', param);

        },

        editZMFavorite: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMFavoriteRest/editZMFavorite', param);

        },

        // /certification/getUserInfo  查询个人信息 电话号码
        myCertificagetUserInfo: function () {
            return Http.post(httpUrl.baseMarketUrl + '/certification/getUserInfo');
        },
        // 评价 
        createEvaluation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMEvaluationRest/createEvaluation', param);

        },

        //       分页查询
        pageQueryEvaluation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMEvaluationRest/pageQueryEvaluation', param);

        },

        //        查询平均打分
        queryAverageScore: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMEvaluationRest/queryAverageScore?id=' + param);

        },


        //  查詢是否有认证
        get_certification: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/certification/get', param);
        },

        //  分页查询经纪人接收的 成果 委托
        pageListTechBrokerReceivedProjectDelegation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListTechBrokerReceivedProjectDelegation?id=' + param.id, param.paramDTO);
        },

        //  分页查询经纪人接收的 [需求] 委托
        pageListTechBrokerReceivedDemandDelegation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListTechBrokerReceivedDemandDelegation?id=' + param.id, param.paramDTO);
        },

    }
})
