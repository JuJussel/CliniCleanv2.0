import globals from '../globals'

export default {
  methods: {
    doRequest (type, data) {
      let self = this
      var promise = new Promise(function (resolve, reject) {
        const server = globals.apiURL + '/ccapi/'
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
          },
          getPatientDetails: {
            url: 'get/patient/patientDetails/getPatientDetails',
            method: 'get'
          },
          updatePatientData: {
            url: 'update/patient/updatePatientData',
            method: 'post'
          },
          patientIDSearch: {
            url: 'get/patient/patientIDSearch',
            method: 'get'
          },
          updateEvent: {
            url: 'update/schedule/updateEvent',
            method: 'post'
          },
          insertNewEvent: {
            url: 'insert/schedule/insertNewEvent',
            method: 'post'
          },
          deleteEvent: {
            url: 'update/schedule/deleteEvent',
            method: 'post'
          },
          getKouiState: {
            url: 'get/karte/getKouiState',
            method: 'get'
          },
          getShinsatsuState: {
            url: 'get/karte/getShinsatsuState',
            method: 'get'
          },
          shohou_timing: {
            url: 'get/karte/lists/shohou_timing',
            method: 'get'
          },
          tempSaveKouiState: {
            url: 'insert/karte/tempSaveKouiState',
            method: 'post'
          },
          tempSaveShinsatsuState: {
            url: 'insert/karte/tempSaveShinsatsuState',
            method: 'post'
          },
          uploadImage: {
            url: 'insert/common/uploadImage',
            method: 'post'
          },
          getSchemas: {
            url: 'get/karte/lists/schema',
            method: 'get'
          },
          schemaUpload: {
            url: 'insert/common/schemaUpload',
            method: 'post'
          },
          getKouiList: {
            url: 'get/karte/lists/getKouiList',
            method: 'get'
          },
          getKensaSpec: {
            url: 'get/karte/lists/getKensaSpec',
            method: 'get'
          },
          checkKoui: {
            url: 'get/karte/checkKoui',
            method: 'post'
          },
          patientDetailsKarte: {
            url: 'get/karte/patientDetailsKarte',
            method: 'get'
          },
          addKouiHistory: {
            url: 'insert/karte/addKouiHistory',
            method: 'post'
          },
          patientSupData: {
            url: 'insert/karte/patientSupData',
            method: 'post'
          },
          patientNote: {
            url: 'insert/karte/patientNote',
            method: 'post'
          },
          insertVital: {
            url: 'insert/karte/insertVitals',
            method: 'post'
          },
          insertTeikiShohou: {
            url: 'insert/karte/insertTeikiShohou',
            method: 'post'
          },
          getByoumeiList: {
            url: 'get/karte/lists/getByoumeiList',
            method: 'get'
          },
          insertByoumei: {
            url: 'insert/karte/insertByoumei',
            method: 'post'
          },
          updateByoumei: {
            url: 'update/karte/updateByoumei',
            method: 'post'
          },
          insertAllergy: {
            url: 'insert/karte/insertAllergy',
            method: 'post'
          },
          updateAllergy: {
            url: 'update/karte/updateAllergy',
            method: 'post'
          },
          insertProblem: {
            url: 'insert/karte/insertProblem',
            method: 'post'
          },
          updateProblem: {
            url: 'update/karte/updateProblem',
            method: 'post'
          },
          karteDisplay: {
            url: 'get/karte/karteDisplay',
            method: 'get'
          },
          kenkoushindanDisplay: {
            url: 'get/karte/kenkoushindanDisplay',
            method: 'get'
          },
          getECGTypes: {
            url: 'get/karte/lists/ecg_cats',
            method: 'get'
          },
          getSetFolders: {
            url: 'get/karte/lists/getSetFolders',
            method: 'get'
          },
          newSet: {
            url: 'insert/karte/newSet',
            method: 'post'
          },
          pauseShinsatsu: {
            url: 'insert/karte/pauseShinsatsu',
            method: 'post'
          },
          kensaResults: {
            url: 'get/karte/lists/kensaResults',
            method: 'get'
          },
          insertShinsatsuData: {
            url: 'insert/karte/insertShinsatsuData',
            method: 'post'
          },
          getTasks: {
            url: 'get/karte/tasks/getTasks',
            method: 'get'
          },
          assignTask: {
            url: 'update/task/assignTask',
            method: 'post'
          },
          getTaskDetails: {
            url: 'get/karte/tasks/getTaskDetails',
            method: 'get'
          },
          updateTask: {
            url: 'update/task/updateTask',
            method: 'post'
          }
        }
        // End types
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
