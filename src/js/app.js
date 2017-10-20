var api = 'http://localhost:3000/https://cuacfm.org/radioco-beta/api/2/';

angular
  .module('app', [ 'ngSanitize' ])
  .factory('API', API)
  .component('main', {
    controller: main,
    templateUrl: '/main.html'
  })
  .component('programme', {
    bindings: {
      data: '<'
    },
    controller: programme,
    templateUrl: '/programme.html'
  })
  .component('transmission', {
    bindings: {
      data: '<',
      onSelect: '&'
    },
    controller: transmission,
    templateUrl: '/transmission.html'
  })
  .factory('Util', Util);

function API($http, Util) {
  const public = {
    getProjects: getProjects,
    getCurrentTransmission: getCurrentTransmission,
    getNextTransmissions: getNextTransmissions
  };
  return public;

  function getProjects() {
    return $http.get(api + 'programmes?after=' + Util.today + '&before=' + Util.tomorrow).then(function(res) { return res.data; });
  }

  function getCurrentTransmission() {
    return $http.get(api + 'transmissions/now').then(function(res) { return res.data; });
  }

  function getNextTransmissions() {
    return $http.get(api + 'transmissions?after=' + Util.today + '&before=' + Util.tomorrow).then(function(res) { return res.data; });
  }
}

function main(API) {
  let self = this;
  self.search = '';
  API.getProjects().then(function(data) {
    self.programmes = data;
  });
  API.getCurrentTransmission().then(function(data) {
    self.current = data;
  });
  API.getNextTransmissions().then(function(data) {
    self.transmissions = data;
    self.next = function() {
      return self.transmissions.filter(function(t) { return new Date(t.start) > new Date(); });
    };
    self.previous = function() {
      return self.transmissions.filter(function(t) { return new Date(t.start) < new Date(); });
    }
  });
  self.selectProgramme = function(slug) {
    self.selectedProgramme = self.programmes.find(function(p) { return p.slug == slug; });
  }
}

function programme($sce) {
  let self = this;
  self.getUrl = function(str) {
    return str.replace('/rss', '');
  }

  self.synopsis = function() {
    return $sce.trustAsHtml(self.data.synopsis);
  };
}

function transmission() {
  let self = this;

  self.duration = function() {
    return new Date(self.data.end) - new Date(self.data.start);
  };
}

function Util() {
  const today = _today();
  const tomorrow = _today((new Date()).getTime() + 24 * 60 * 60 * 1000);

  return {
    today: today,
    tomorrow: tomorrow
  };

  function _today(ms) {
    const date = new Date();
    if (ms) {
      date.setTime(ms);
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
}
