define([], function () {
  return {
    // 业务类型
    businessType: {
      login: '001',
      reg: '002',
      pwd: '003',
      bindphone: '004',
      bindemail: '005',
      destroy: '006',
      kjzx_reg_email: '007',
      kjzx_pwd: '008',
      //验证码类型 --易智商城投诉
      BUSINESS_TYPE_009: "009",
      //验证码类型 --易智商城投诉快速发布需求
      BUSINESS_TYPE_010: "010"
    },
    locaKey: {
      USER_INFO: 'USER_INFO',
      LOGIN_INFO: 'LOGIN_INFO',
      SAASID: 'saasId',
      AUTHORITY: 'AUTHORITY'
    },
		/**
		 * 附件类型字典
		 */
    attachmentType: {
      main: '01', // 主图
      mainVideo: '02', // 主图视频
      goodsVideo: '03', // 商品视频
      techVal: '04', // 技术价值
      mature: '05', // 成熟度
      secrecy: '06', // 资料保密（对所交付的所有资料进行保密）
      video: '07', // 视频
      other: '08' // 其他
    },
		/**
		 * 控件类型字典
		 */
    controlType: {
      addressSelect: '001', // 国家省份城市区县联动下拉列表
      input: '002', // input输入框
      date: '003', // 日期选择框
      datetime: '004', // 日期时间选择框
      select: '005', // 单选下拉框
      mulSelect: '006', // 下拉多选框
      textarea: '007' // textarea输入框
    },
		/**
		 * 附加属性类型
		 */
    goods_service_type: {
      after_sale_service: '001', // 售后服务
      translation_service: '002', // 物流服务
      transaction_mode: '003', // 交易方式
      pay_mode: '004', // 支付方式
      administrative_division1: '005', // 国家
      administrative_division2: '006', // 省份
      administrative_division3: '007', // 城市
      administrative_division4: '008', // 区县
      service_promise: '009', // 服务承诺
    },
    // 首页栏目
    columns: {
      policy_interest: '97338374947341056', // 政策红利
      technology_information: '005', // 科技咨询
      technology_transfer: "004", // 技术转移
      business_incubation: '006', // 创业孵化
      technology_finance: '007', // 科技金融
      // 汽车
      "car": {
        id: '008',
        child: {
          // design: '012', // 研发设计
          // inspection_and_testing: '013', // 检验检测
          demand: '015', // 找需求
          technology: '014', // 找技术
          service: '016', // 找服务
          expert: '017', // 找专家
          mechanism: '018', // 找机构
          jcService: '019', // 找服务
        }
      },
      // 物联网
      "internet_of_things": {
        id: '009',
        child: {
          // design: '020', // 研发设计
          // inspection_and_testing: '021', // 检验检测
          demand: '023', // 找需求
          technology: '022', // 找技术
          service: '024', // 找服务
          expert: '025', // 找专家
          mechanism: '026', // 找机构
          jcService: '027', // 找服务
        }
      },
      // 集成电路
      "integrated_circuit": {
        id: '010',
        child: {
          // design: '028', // 研发设计
          // inspection_and_testing: '029', // 检验检测
          demand: '031', // 找需求
          technology: '030', // 找技术
          service: '032', // 找服务
          expert: '033', // 找专家
          mechanism: '034', // 找机构
          jcService: '035', // 找服务
        }
      },
      // 工程机械
      "construction_machinery": {
        id: '011',
        child: {
          // design: '036', // 研发设计
          // inspection_and_testing: '037', // 检验检测
          demand: '039', // 找需求
          technology: '038', // 找技术
          service: '040', // 找服务
          expert: '041', // 找专家
          mechanism: '042', // 找机构
          jcService: '043', // 找服务
        }
      },
      integrated_science: '044', // 综合科技服务
    },
    // 综合科技栏目
    schemecolumns: {
      business_incubation: {
        id: '045', // 创业孵化
        park_institution: '046', // 园区-投资机构
        Incubator_institution: '047', // 孵化器-投资机构
        Investment_institutions: '048' // 众创空间-投资机构
      },
      expert_resources: {// 专家资源
        id: '044',
        collegesUniversities: {// 高校院所'
          picture_mod: '069',// 图片板块
          tackling_problems: '070',// 难题攻关
          applied_research: '071',// 应用研发
        },
        learn: {// 学会
          picture_mod: '065',// 图片板块
          tackling_problems: '066',// 难题攻关
          applied_research: '067',// 应用研发
        },
        RDcenter: {// 研发中心
          picture_mod: '061',// 图片板块
          tackling_problems: '062',// 难题攻关
          applied_research: '063',// 应用研发
        }
      },
      achievement_transformation: {
        id: '072',//成果转化
        Looking_patents: '073', //找专利
        Looking_technology: '074',// 找技术
        Looking_produce: '075',// 找产品
      },
      technology_service: {
        id: '049', // 科技服务
        technology_transfer:// 技术转移
        {
          id: '053',
          Service_providers: '054' //优选服务商
        },
        intellectual_right: {// 知识产权
          id: '055',
          Service_providers: '056' //优选服务商
        },
        technology_consultation: {// 科技咨询'
          id: '057',
          Service_providers: '058' //优选服务商
        }
      }
    },
    goodsCategoryCode: {
      technology: '001', // 技术
      product: '010', // 产品
      service: '009', // 服务
      resource: '011', // 资源
      demand: '',
      shop: '',
      source: '001,010'
    },
    searchTypes: {
      '01': 'demand',
      '02': 'shop',
      '03': 'technology',
      '04': 'service',
      '05': 'product',
      '06': 'resource'
    },
    imgs: ['jpg', 'jpeg', 'png', 'gif', 'Webp', 'bmp', 'tif'],
    zips: ['zip', 'rar', '7z', 'arj', 'CAB', 'ARJ', 'LZH', 'TAR', 'GZ', 'ACE', 'UUE', 'BZ2', 'JAR'],
    doc: ['doc', 'docx'],
    excel: ['xls', 'xlsx'],
    ppt: ['ppt', 'pptx']
  }
})
