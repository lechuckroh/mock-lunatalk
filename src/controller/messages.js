const config = require('config');
const winston = require('winston');

/** 파라미터 validation (2000) */
const validateParams = function (userid, api_key, template_id, messages) {
  const msgList = [];

  if (!userid) {
    msgList.push('userid 필드는 필수입니다.');
  } else {
    if (typeof userid !== 'string') {
      msgList.push('The userid must be a string.');
    }
  }
  if (!api_key) {
    msgList.push('api key 필드는 필수입니다.');
  } else {
    if (typeof api_key !== 'string') {
      msgList.push('The api key must be a string.');
    }
  }

  if (!template_id) {
    msgList.push('template id 필드는 필수입니다.');
  } else {
    if (!/[0-9]+$/.test(template_id)) {
      msgList.push('template id은(는) 반드시 정수여야 합니다.');
    }
  }
  if (!messages) {
    msgList.push('messages 필드는 필수입니다.');
  } else {
    if (!Array.isArray(messages)) {
      msgList.push('messages은(는) 반드시 배열이어야 합니다.');
    } else if (messages.length === 0) {
      msgList.push('messages 필드는 필수입니다.');
    }
  }

  if (msgList.length > 0) {
    return {
      code: 2000,
      msg: msgList
    };
  }
  return {
    code: 0,
    msg: []
  };
};

/** 메시지 validation */
const validateMessages = function (messages) {
  const result = {
    code: 0,
    msg: ''
  };

  messages.every(msg => {
    const {
      no,
      tel_num,
      msg_content,
      sms_content,
      use_sms,
      btn_url
    } = msg;

    // messages.no 인덱스가 없음 (2001)
    if (!no) {
      result.code = 2001;
      result.msg = '[2001] messages.no 가 필요합니다.';
      return false;
    }

    // messages.tel_num 인덱스가 없음 (2002)
    if (!tel_num) {
      result.code = 2002;
      result.msg = `[2002] messages.tel_num 가 필요합니다. 메세지 번호 : ${no}`;
      return false;
    }

    // messages.msg_content 인덱스가 없음 (2003)
    if (!msg_content) {
      result.code = 2003;
      result.msg = `[2003] messages.msg_content 가 필요합니다. 메세지 번호 : ${no}`;
      return false;
    }

    // messages.sms_content 인덱스가 없음 (2004)
    if (!sms_content) {
      result.code = 2004;
      result.msg = `[2004] messages.sms_content 가 필요합니다. 메세지 번호 : ${no}`;
      return false;
    }

    // messages.use_sms 인덱스가 없음 (2005)
    if (!use_sms) {
      result.code = 2005;
      result.msg = `[2005] messages.use_sms 가 필요합니다. 메세지 번호 : ${no}`;
      return false;
    }

    // messages.btn_url 인덱스가 없음 (2006)
    if (!btn_url) {
      result.code = 2006;
      result.msg = `[2006] messages.btn_url 가 필요합니다. 메세지 번호 : ${no}`;
      return false;
    }
    if (typeof btn_url !== "object") {
      result.code = 2006;
      result.msg = `[2006] messages.btn_url 은 반드시 object이어야 합니다. 메세지 번호 : ${no}`;    // eslint-disable-line
      return false;
    }

    // messages.msg_content 길이 초과 (2007)
    if (msg_content.length > 1000) {
      result.code = 2007;
      result.msg = `[2007] messages.msg_content 의 길이는 1000 자 이하입니다. 메세지 번호 : ${no}`;    // eslint-disable-line
      return false;
    }

    // messages.sms_content 길이 초과 (2008)
    if (sms_content.length > 1000) {
      result.code = 2008;
      result.msg = `[2008] messages.sms_content 의 길이는 1000 자 이하입니다. 메세지 번호 : ${no}`;    // eslint-disable-line
      return false;
    }

    // messages.tel_num 유효하지 않은 전화번호 (2009)
    if (!/^0?1[016789]-?[0-9]{3,4}-?([0-9]{4})$/.test(tel_num)) {
      result.code = 2009;
      result.msg = `[2009] messages.tel_num의 번호가 유효하지 않습니다. 메세지 번호 : ${no}`;    // eslint-disable-line
      return false;
    }

    // btn_url
    for (let i = 0; ; i++) {
      const item = btn_url[i.toString(10)];
      if (!item) {
        break;
      }
      const {url_pc, url_mobile} = item;

      // messages.btn_url.url_pc의 길이 초과 (2010)
      if (url_pc.length > 100) {
        result.code = 2010;
        result.msg = `[2010] messages.btn_url.url_pc 의 길이는 100 자 이하입니다. 메세지 번호 : ${no}`;    // eslint-disable-line
        return false;
      }

      // messages.btn_url.url_mobile의 길이 초과 (2011)
      if (url_mobile.length > 100) {
        result.code = 2011;
        result.msg = `[2011] messages.btn_url.url_mobile 의 길이는 100 자 이하입니다. 메세지 번호 : ${no}`;    // eslint-disable-line
        return false;
      }
    }

    return true;
  });

  return result;
};

/**
 * 쇼핑몰 정보 validation (3000)
 */
const validateShoppingMall = function () {
  return {
    code: 0,
    msg: 'not implemented'
  };
};

/**
 * 템플릿 정보 validation (3001)
 */
const validateTemplate = function (templateId) {
  if (!config.get('validTemplateId').includes(templateId)) {
    return {
      code: 3001,
      msg: '[3001] template id 를 찾을 수 없음'
    };
  }
  return {
    code: 0,
    msg: ''
  };
};

/**
 * Lunasoft 회원 정보 validation (3002)
 */
const validateUserid = function (userId) {
  if (!config.get('validUserId').includes(userId)) {
    return {
      code: 3002,
      msg: '[3002] 회원 정보 찾을 수 없음'
    };
  }
  return {
    code: 0,
    msg: ''
  };
};

exports.postSend = function (ctx) {
  // 요청 파라미터
  const {
    userid,
    api_key,
    template_id,
    messages
  } = ctx.request.body || {};

  const validators = [
    () => validateParams(userid, api_key, template_id, messages),
    () => validateMessages(messages),
    () => validateShoppingMall(),
    () => validateTemplate(template_id),
    () => validateUserid(userid)
  ];

  const ok = validators.every(validator => {
    try {
      const result = validator();

      // 에러 발생시 (결과 코드가 0이 아닌 경우)
      if (result.code > 0) {
        ctx.status = 200;
        ctx.body = result;
        return false;
      }

      return true;
    } catch (e) {
      winston.error(e);
      ctx.status = 500;
      ctx.body = e;
      return false;
    }
  });

  // 에러가 없는 경우
  if (ok) {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: ''
    };
  }
};
