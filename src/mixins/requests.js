export default {
  methods: {
    doRequest (type, data) {
      let self = this
      var promise = new Promise(function (resolve, reject) {
        const server = 'https://192.168.11.99/ccapi/'
        const sessionID = sessionStorage.getItem('session_id') == null ? '' : sessionStorage.getItem('session_id')
        var $ = require('jquery')
        var types = {
          login: {
            url: 'session/login',
            method: 'post'
          },
          sessionCheck: {
            url: 'session/sessionTime',
            method: 'post'
          },
          logout: {
            url: 'session/logout',
            method: 'post'
          },
          getTaskNumber: {
            url: 'get/getTaskNumber',
            method: 'post'
          },
          getUsername: {
            url: 'get/getUsername',
            method: 'post'
          },
          getLists: {
            url: 'get/getLists',
            method: 'get'
          },
          getUserList: {
            url: 'get/getUserList',
            method: 'post'
          },
          getDate: {
            url: 'get/getDate',
            method: 'get'
          },
          getTasksShinsatsu: {
            url: 'get/getTasksShinsatsu',
            method: 'post'
          },
          getShinsatsuType: {
            url: 'get/patient/getShinsatsuType',
            method: 'get'
          },
          getReceptionFlow: {
            url: 'get/patient/getReceptionFlow',
            method: 'get'
          },
          getReceptionFlowReservations: {
            url: 'get/patient/getReceptionFlowReservations',
            method: 'get'
          },
          getQuickPatientSearch: {
            url: 'get/patient/getQuickPatientSearch',
            method: 'get'
          },
          getReceptionInsurance: {
            url: 'get/patient/getReceptionInsurance',
            method: 'get'
          },
          newWalkin: {
            url: 'insert/patient/newWalkin',
            method: 'post'
          },
          insertOrder: {
            url: 'insert/karte/insertOrder',
            method: 'post'
          },
          updateReservation: {
            url: 'insert/patient/updateReservation',
            method: 'post'
          },
          getOrcaKouiStatus: {
            url: 'get/patient/getOrcaKouiStatus',
            method: 'get'
          },
          insertPayment: {
            url: 'insert/patient/insertPayment',
            method: 'post'
          },
          moveReceptionToShinsatsu: {
            url: 'insert/patient/moveReceptionToShinsatsu',
            method: 'post'
          },
          getAddressFromZip: {
            url: 'get/getAddressFromZip',
            method: 'get'
          },
          getInsuranceInfo: {
            url: 'get/patient/getInsuranceInfo',
            method: 'get'
          },
          patientDouble: {
            url: 'get/patient/patientDouble',
            method: 'get'
          },
          getInsuranceCheck: {
            url: 'get/patient/getInsuranceCheck',
            method: 'get'
          },
          newDependent: {
            url: 'insert/patient/newDependent',
            method: 'post'
          },
          newPatient: {
            url: 'insert/patient/newPatient',
            method: 'post'
          },
          getPatientSearch: {
            url: 'get/patient/getPatientSearch',
            method: 'get'
          }

        } // End types
        // Request function
        if (types[type].method === 'get') {
          $.get(server + types[type].url + '.php',
            { session_id: sessionID, data: data },
            function (result) {
              result = $.parseJSON(result)
              if (result.err) {
                if (result.msg === 'si') {
                  self.$eventHub.$emit('sessionInvalid')
                } else {
                  alert(result.msg)
                }
              } else {
                resolve(result)
              }
            }
          )
        } else {
          $.post(server + types[type].url + '.php',
            { session_id: sessionID, data: data },
            function (result) {
              result = $.parseJSON(result)
              if (result.err) {
                if (result.msg === 'si') {
                  self.$eventHub.$emit('sessionInvalid')
                } else {
                  alert(result.msg)
                }
              } else {
                resolve(result)
              }
            }
          )
        }
      })
      return promise
    }
  }
}
