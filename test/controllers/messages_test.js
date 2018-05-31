/* eslint-disable */
const app = require('../../src/app');
const request = require('supertest').agent(app.server);
const config = require('config');

const validTemplateIdList = config.get('validTemplateId');
const validUserIdList = config.get('validUserId');


describe('POST /lunatalk/api/message/send', function () {
  context('2000 필수 파라미터 누락', function () {
    const testset = [{}, {
      userid: '',
      api_key: 'key',
      template_id: 1,
      messages: ['m']
    }, {
      userid: 'foo',
      api_key: '',
      template_id: 1,
      messages: ['m']
    }, {
      userid: 'foo',
      api_key: 'key',
      template_id: '',
      messages: ['m']
    }, {
      userid: 'foo',
      api_key: 'key',
      template_id: 'foo',
      messages: ['m']
    }, {
      userid: 'foo',
      api_key: 'key',
      template_id: 1,
      messages: ''
    }, {
      userid: 'foo',
      api_key: 'key',
      template_id: 1,
      messages: []
    }];

    testset.forEach((test, idx) => {
      it(`#${idx}`, async function () {
        await request
          .post('/lunatalk/api/message/send')
          .send({})
          .expect(res => {
            const body = res.body || {};
            body.should.have.property('code', 2000);
          })
          .expect(200);
      });
    });
  });

  it('2001 messages.no 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{}]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2001);
      })
      .expect(200);
  });

  it('2002 messages.tel_num 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2002);
      })
      .expect(200);
  });

  it('2003 messages.msg_content 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678'
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2003);
      })
      .expect(200);
  });

  it('2004 messages.sms_content 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678',
          msg_content: 'hello'
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2004);
      })
      .expect(200);
  });

  it('2005 messages.use_sms 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678',
          msg_content: 'hello',
          sms_content: 'hello'
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2005);
      })
      .expect(200);
  });

  it('2006 messages.btn_url 미지정', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678',
          msg_content: 'hello',
          sms_content: 'hello',
          use_sms: 1,
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2006);
      })
      .expect(200);
  });

  it('2007 messages.msg_content 길이초과', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678',
          msg_content: 'a'.repeat(1001),
          sms_content: 'hello',
          use_sms: 1,
          btn_url: {
            0: {
              url_pc: 'http://abc.com',
              url_mobile: 'http://abc.com',
            }
          }
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2007);
      })
      .expect(200);
  });

  it('2008 messages.sms_content 길이초과', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '1012345678',
          msg_content: 'a'.repeat(1000),
          sms_content: 'a'.repeat(1001),
          use_sms: 1,
          btn_url: {
            0: {
              url_pc: 'http://abc.com',
              url_mobile: 'http://abc.com',
            }
          }
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2008);
      })
      .expect(200);
  });

  context('2009 messages.tel_num 유효하지 않은 전화번호', function () {
    const telNumList = [
      'aaa',
      '010-12345-6789',
      '010-12-5678',
      '010-1234-567',
      '01255556666',
    ];

    telNumList.forEach((telNum, idx) => {
      it(`[${idx}] ${telNum}`, async function () {
        await request
          .post('/lunatalk/api/message/send')
          .send({
            userid: 'foo',
            api_key: 'key',
            template_id: 1,
            messages: [{
              no: 1,
              tel_num: telNum,
              msg_content: 'hello',
              sms_content: 'hello',
              use_sms: 1,
              btn_url: {
                0: {
                  url_pc: 'http://abc.com',
                  url_mobile: 'http://abc.com',
                }
              }
            }]
          })
          .expect(res => {
            const body = res.body || {};
            body.should.have.property('code', 2009);
          })
          .expect(200);
      });
    });
  });

  it('2010 messages.btn_url.url_pc 길이초과', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '010-1234-5678',
          msg_content: 'hello',
          sms_content: 'hello',
          use_sms: 1,
          btn_url: {
            0: {
              url_pc: 'a'.repeat(101),
              url_mobile: 'http://abc.com',
            }
          }
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2010);
      })
      .expect(200);
  });

  it('2011 messages.btn_url.url_mobile 길이초과', async function () {
    await request
      .post('/lunatalk/api/message/send')
      .send({
        userid: 'foo',
        api_key: 'key',
        template_id: 1,
        messages: [{
          no: 1,
          tel_num: '010-1234-5678',
          msg_content: 'hello',
          sms_content: 'hello',
          use_sms: 1,
          btn_url: {
            0: {
              url_pc: 'http://abc.com',
              url_mobile: 'a'.repeat(101),
            }
          }
        }]
      })
      .expect(res => {
        const body = res.body || {};
        body.should.have.property('code', 2011);
      })
      .expect(200);
  });

  context('3001 template id 를 찾을 수 없음', function () {
    const templateIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const userId = validUserIdList[0];

    templateIdList.forEach((templateId, idx) => {
      const valid = validTemplateIdList.includes(templateId);
      const expectedCode = valid ? 0 : 3001;

      it(`[${idx}] ${templateId}`, async function () {
        await request
          .post('/lunatalk/api/message/send')
          .send({
            userid: userId,
            api_key: 'key',
            template_id: templateId,
            messages: [{
              no: 1,
              tel_num: '010-1234-5678',
              msg_content: 'hello',
              sms_content: 'hello',
              use_sms: 1,
              btn_url: {
                0: {
                  url_pc: 'http://abc.com',
                  url_mobile: 'http://abc.com',
                }
              }
            }]
          })
          .expect(res => {
            const body = res.body || {};
            body.should.have.property('code', expectedCode);
          })
          .expect(200);
      });
    });
  });

  context('3002 회원정보를 찾을 수 없음', function () {
    const userIdList = [
      'test',
      'admin',
      'foo',
      'bar'
    ];
    const templateId = validTemplateIdList[0];

    userIdList.forEach((userId, idx) => {
      const valid = validUserIdList.includes(userId);
      const expectedCode = valid ? 0 : 3002;

      it(`[${idx}] ${userId}`, async function () {
        await request
          .post('/lunatalk/api/message/send')
          .send({
            userid: userId,
            api_key: 'key',
            template_id: templateId,
            messages: [{
              no: 1,
              tel_num: '010-1234-5678',
              msg_content: 'hello',
              sms_content: 'hello',
              use_sms: 1,
              btn_url: {
                0: {
                  url_pc: 'http://abc.com',
                  url_mobile: 'http://abc.com',
                }
              }
            }]
          })
          .expect(res => {
            const body = res.body || {};
            body.should.have.property('code', expectedCode);
          })
          .expect(200);
      });
    });
  });

});