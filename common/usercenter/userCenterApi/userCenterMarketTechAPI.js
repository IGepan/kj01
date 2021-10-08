/**
 * 技术经纪人接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {
    console.log(httpUrl.baseMarketUrl)
    return {


        //////////////////////////////////////////// 资格认证//////////////////////////////////////////////////////

        //  查詢是否有认证
        get_certification: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/certification/get', param);
        },


        // 查询技术成果分类字典
        dictionary_type_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zSDictTypeValRest/listMultiZSDictTypeVal', param);
        },

        // 新增、编辑 经纪人
        edit_broker_form: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/insertZMTechBroker', param);
        },


        // 新增、编辑 技术转移机构
        edit_tech_organ: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechOrganRest/insertZMTechOrgan', param);
        },

        // 新增、编辑 投资机构
        edit_tech_investment: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMInvestmentRest/saveZMInvestment', param);
        },


        // 查询附件
        find_attachment_query: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/mFileInfoRest/findMFileInfoById?id=' + param);
        },

        // 查询技术转移机构列表 不翻译字典 不增加阅读量
        queryDetailsNative: function (param) {
            var query = "id=" + param.id + "&organName=" + param.organName;
            return Http.post(httpUrl.baseMarketUrl + '/zMTechOrganRest/queryDetailsNative?' + query, param);
        },


        saveZMVerifyBind: function (param) {

            return Http.post(httpUrl.baseMarketUrl + '/zMVerifyBindRest/saveZMVerifyBind', param);
        },
        verifyZMVerifyBind: function (param) {

            return Http.post(httpUrl.baseMarketUrl + '/zMVerifyBindRest/verifyZMVerifyBind', param);
        },
        pageZMVerifyBindByDTO: function (param) {

            return Http.post(httpUrl.baseMarketUrl + '/zMVerifyBindRest/pageZMVerifyBindByDTO', param);
        },


        // //////////绑定机构
        pageZMVerifyBindVO: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMVerifyBindRest/pageZMVerifyBindVO', param);
        },

        // ////////// 查询经纪人详情
        myCertificateBrokerDetails: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + '/uc/myCertificate', param);
        },

        // /certification/getUserInfo  查询个人信息 电话号码

        myCertificagetUserInfo: function () {
            return Http.post(httpUrl.baseMarketUrl + '/certification/getUserInfo');
        },

        getZmImg: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/downloadImg', param);
        },

        ///////////////////////////////////////// 业务管理/////////////////////////////////////////////////////////


        // 分页查询我发送的投递项目
        find_my_send_project: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListMySendProject', param);
        },


        // 分页查询我发送的邀约信息
        find_my_send_invitation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListSendInvitation', param);
        },

        //////////////////////////////////////////学堂外链///////////////////////////////////////////////////////

        // 查询技术成果分类字典
        turn_page_class_sign: function () {
            return Http.post(httpUrl.baseSchoolOutUrl + '/uc/myClass');
        },


        turn_page_class_sign_1: function () {
            var userPhone = localStorage.getItem("userPhone");
            if (null == userPhone && "" == userPhone || undefined == userPhone) {
                window.location.href = '/common/login.html';
            }
            var url = httpUrl.baseSchoolOutUrl + "/uc/myClass";
            var password = "YVc1NFpXUjFZVmMxTkZwWFVqRlpWbU14VGtad1dGVnFSbHBXYlUxNFZHdGFkMWRHVm5GU2JIQlhZbFV4TkZaSGRHRmtNV1JIVm01R1UxZEhhRTlaVjNOM1pERlNjMVZ0Um1oU2JHOHlWbXhTUTFkSFNraFZiRkpWVm10Vk5WVkdaRWRYUlRWVlZXMUdWMDFWYkRSWlZtTXhUa1p3V0ZWcVJUMWhWelUwV2xkU01RPT1hVzU0WldSMQ==";
            var query = "password=" + password + "&account=" + userPhone + "&ipForget=true&url=" + url;
            // window.open();
            return Http.post(httpUrl.baseSchoolOutUrl + "/user/ajax/login?" + query);
        },


        //////////////////////////////////////////技术成果///////////////////////////////////////////////////////

        // 查询技术成果 省市区分类字典


        // 查询技术成果 省市区分类字典
        find_province_city: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zSDictTypeValRest/getNextAdministrationsByValue?value=' + param);
        },


        // 个人中心技术成果 分页查询
        find_technology_pages: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/pageMyProjectInfo', param);
        },

        // 技术成果详情
        find_technology_details: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/queryDetailsNative?id=' + param);
        },

        //技术经理人绑定技术转移机构
        bindTechOrgan: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/bindTechOrgan' + param);
        },


        // 查询技术标签
        // /zMTagRest/listTagTree/{code}
        // 查询附件
        find_list_tag_tree: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMTagRest/listTagTree/' + param);
        },

        //查询地区
        selectAllArea: function () {
            return Http.get(httpUrl.baseUrl + '/dict/info/selectAllArea');
        },

        // // 技术成果专利分页查询

        find_query_page_patent: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/queryPagePatent', param);
        },


        // 技术成果专利详情查询
        find_project_patent_details: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/queryProjectPatentInfo?id=' + param);
        },


        // 删除成果专利数据
        del_project_patent_info: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/deleteZMProjectPatent?id=' + param);
        },


        //上架下架成果数据
        techShelves: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMProjectRest/shelves?flag=' + param.flag + "&id=" + param.id);
        },


        //  上架下架需求数据
        demandShelves: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMDemandRest/shelves?flag=' + param.flag + "&id=" + param.id);
        },

        //更新用户信息
        eduUserInfo: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + '/update/eduUserInfo', param);
        },

        //////////////////////////////////////////技术成果填写信息///////////////////////////////////////////////////////

        // 查询技术成果分类字典
        province_city_list: function (param) {
            return Http.post(httpUrl.baseUrl + '/dict/select', param);
        },

        //新增技术成果
        save_technology_results: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/saveZMProject', param);
        },

        //保存技术成果转化数据
        save_technology_convert: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/saveZMProjectConvert', param);
        },

        //  新增或修改技术成果专利数据
        save_ZMProject_patent: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/saveZMProjectPatent', param);
        },


        //////////////////////////////////////////班级报名 ClassSign///////////////////////////////////////////////////////

        // 查询技术成果分类字典
        find_tech_transfer_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '//', param);
        },

        //////////////////////////////////////////收集 Collection///////////////////////////////////////////////////////
        // 查询技术成果分类字典
        find_tech_collection_list: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMFavoriteRest/listZMFavoriteByDTO', param);
        },

        // 查询翻页
        find_tech_collection_page: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMFavoriteRest/pageZMFavorite', param);
        },


        // 查询翻页
        pageZMFavoriteByVO: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMFavoriteRest/pageZMFavoriteByVO', param);
        },


        //////////////////////////////////////////需求 Require///////////////////////////////////////////////////////


        // 查询技术成果分类字典 国家省市区


        // 个人中心技术需求 分页查询
        find_technology_require_pages: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/pageMyDemandBaseInfo', param);
        },


        //新增技术需求
        save_technology_require_results: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/saveZMDemand', param);
        },


        //  查询技术需求详情
        find_require_details_results: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/queryDetailsNative?id=' + param);

        },


        //////////////////////////////////////////技术转移 Transfer///////////////////////////////////////////////////////

        // 分页查询我接收的项目投递
        find_my_receive_project: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListMyReceivedProject', param);
        },


        // 分页查询我接收的邀约信息
        find_my_receive_invitation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListReceivedInvitation', param);
        },


        //分页查询我接收的 [需求 / 成果] 委托
        pageListMyReceivedDelegation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListMyReceivedDelegation', param);
        },


        // 新增修改日志
        zMBusinessLogRest: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMBusinessLogRest/saveLog', param);
        },

        // 删除日志
        deleteTechBrokerBind: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMBusinessLogRest/del/' + param);
        },


        // 分頁查询日志 分页查询日志,通过申请id
        zMLogQueryPageRest: function (id, param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMBusinessLogRest/queryPageLog/' + id, param);
        },


        // /zMOrderRest/createOrder 接受
        accept_create_order: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMOrderRest/createOrder?requestId=' + param);
        },

        // 分页查询我发送的 [需求 / 成果] 委托
        pageListMySendDelegation: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMRequestRest/pageListMySendDelegation', param);
        },


        //   拒绝申请
        reject_request_order: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMOrderRest/rejectRequest?requestId=' + param);
        },

        //////////////////////////////////////////业务订单 BusinessOrder///////////////////////////////////////////////////////

        //分页查询
        pageOrderInfo: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMOrderRest/pageOrderInfo', param);
        },


        //完成订单
        finishOrder: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMOrderRest/finishOrder', param);
        },

        //////////////////////////////////////////////////////分页查询匹配////////////////////////////////////////////////////////

        // 查询匹配的技术经纪人信息 通过需求id或成果id
        queryMatchInfoBroker: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMTechBrokerRest/queryMatchInfo', param);
        },


        // 查询匹配的技术成果需求信息 通过技术经纪人id或成果id
        queryMatchInfoDemand: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMDemandRest/queryMatchInfo', param);
        },


        // 查询匹配的技术成果信息 通过技术经纪人id或需求id
        queryMatchInfoProject: function (param) {
            return Http.post(httpUrl.baseMarketUrl + '/zMProjectRest/queryMatchInfo', param);
        },

        //机构移除经纪人绑定
        removeTechBrokerBind: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMVerifyBindRest/removeTechBrokerBind/' + param);
        },
    }
})
