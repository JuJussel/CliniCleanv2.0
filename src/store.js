import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lists: {},
    message: '',
    constants: {
      mapUrl: 'https://192.168.11.99/MAPS/tileserver.php',
      mapName: 'CliniClean',
      userList: [],
      username: '',
      userID: '',
      date: ''
    },
    componentData: {
      home: {
        tasks: {},
        shinsatsu: ''
      },
      patientDetails: {
        IDselected: '',
        name: ''
      },
      karteDetails: {
        insCombNr: '',
        insCombNrSet: '',
        kouhi: false,
        firstTime: 0,
        jihi: false,
        mode: '',
        patient: {
          id: '',
          name: ''
        },
        shinsatsu: {
          karteID: '',
          historyTemp: [],
          insert_data: []
        }
      }
    }
  },
  mutations: {
    ADD_HISTORYTEMP (state, data) {
      state.componentData.karteDetails.shinsatsu.historyTemp = data
    },
    ADD_SOAPITEM (state, data) {
      var insertData = {}
      insertData.type = data.type
      insertData.cont = data.cont
      if (data.sect === 'f') {
        state.componentData.shinsatsu.soap.f.push(insertData)
      }
    },
    ADD_PROBLEM (state, data) {
      state.componentData.karteDetails.content.problem.push(data)
    },
    ADD_FOLLOWUP (state, data) {
      state.componentData.karteDetails.content.followup.push(data)
    },
    ADD_ALLERGY (state, data) {
      state.componentData.karteDetails.content.allergy.push(data)
    },
    DELETE_SOAPITEM (state, item) {
      state.componentData.shinsatsu.soap.f.splice(item, 1)
    },
    UPDATE_SOAPTEXT (state, data) {
      state.componentData.shinsatsu.soap.f[data.itemID].cont = data.cont
    },
    UPDATE_PATIENT_NOTES (state, data) {
      state.componentData.karteDetails.content.notes = data
    },
    SET_USERNAME (state, usernameNew) {
      state.constants.username = usernameNew
    },
    SET_USERID (state, userIDNew) {
      state.constants.userID = userIDNew
    },
    SET_USERLIST (state, userList) {
      state.constants.userList = userList
    },
    SET_DATE (state, date) {
      state.constants.date = date
    },
    SET_LISTS (state, data) {
      state.lists = data
    },
    UPDATE_KARTEDETAILSMODE (state, mode) {
      state.componentData.karteDetails.mode = mode
    },
    SET_SHINSATSU_INFO (state, data) {
      state.componentData.home.shinsatsu = data.shinsatsuID
      state.componentData.karteDetails.shinsatsu.karteID = data.karteID
      state.componentData.karteDetails.patient.id = data.patientID
      state.componentData.karteDetails.patient.name = data.patientLastname + data.patientFirstname
      state.componentData.karteDetails.jihi = data.jihi
      state.componentData.karteDetails.firstTime = data.firstTime
    },
    SET_KARTE_DETAILS_DATA (state, data) {
      state.componentData.karteDetails.content = data
    },
    SET_KARTE_DETAILS_RESET_DATA (state) {
      state.componentData.karteDetails.content = {}
    },
    SET_PATIENTDETAILS_PATIENT_ID (state, id) {
      state.componentData.patientDetails.IDselected = id
    },
    SET_PATIENTDETAILS_PATIENT_NAME (state, name) {
      state.componentData.patientDetails.name = name
    },
    SET_InsCombNr (state, data) {
      state.componentData.karteDetails.insCombNr = data.insCombNr
      state.componentData.karteDetails.insCombNrSet = data.insCombNrSet
      state.componentData.karteDetails.kouhi = data.kouhi
    }
  },
  actions: {
    setUsername ({ commit }, usernameNew) {
      commit('SET_USERNAME', usernameNew)
    }
  },
  getters: {
    username: state => state.username
  }
})
