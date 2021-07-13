/**
 * 易智学堂接口
 */
define(['httpUrl', 'http'], function (httpUrl, Http) {

    console.log(httpUrl.baseSchoolUrl)
    return {
        // 技术成果列表查询
        tech_school_class_list: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + '/page/classlist', param);
        },

        tech_school_course_list: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + '/front/showcoulist', param);
        },
        tech_school_exam_list: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + '/examList', param);
        },

        // 班级培训详情基础内容
        class_training_details_list: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + "/front/classinfo", param);
        },


        // 班级详情 学习内容getTechLearningContent 
        class_learing_content: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + "/front/ajax/classKpointList", param);
        },

        // 加入学习
        class_training_join: function (param) {
            return Http.post(httpUrl.baseSchoolUrl + "/course/free/addTrxorder", param);
        },

        // /zMVerifyClassRest/insertZMVerifyClass 班级报名
        insertZMVerifyClass: function (param) {
            return Http.post(httpUrl.baseMarketUrl + "/zMVerifyClassRest/insertZMVerifyClass", param);
        },


        // /certification/getUserInfo  查询个人信息 电话号码
        myCertificagetUserInfo: function () {
            return Http.post(httpUrl.baseMarketUrl + '/certification/getUserInfo');
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


        //      查询最后的额报名数据
        unfinishedCourseRegistration: function (param) {
            return Http.get(httpUrl.baseMarketUrl + '/zMVerifyClassRest/queryVerifyClassLatest?courseId=' + param);
        },


    }
})
