;(function(ng) {
  "use strict";

  ng.module('alt.passaporte-listagem-produtos', ['alt.passaporte-informacoes-autorizacao'])
    .service('AltPassaporteListagemProdutosService', ['$http', '$q', 'AuthorizationInfoService', function($http, $q, AuthorizationInfoService) {
      var URL_PASSAPORTE_PRODUTOS = '/passaporte-rest-api/rest/produtos';

      this._parseHttp = function() {
        return $http.get(URL_PASSAPORTE_PRODUTOS).then(function(p) {
          return p.data || {};
        });
      };

      this.getProdutos = function getProdutos() {
        return $q.all([AuthorizationInfoService.getToken(), this._parseHttp()])
                 .then(function(resultado) {
                   var _token = resultado[0];
                   var _produtosWrapper = resultado[1];

                   ng.forEach(_produtosWrapper.habilitados, function(ph) {
                          var _separadorInicial = /\?/.test(ph.urlAutenticacao) ? '&' : '?';
                          ph.urlAutenticacao = ph.urlAutenticacao + _separadorInicial + 'info='
                                                                                      + _token + '&idProduto='
                                                                                      + ph.chave;
                   });

                   return _produtosWrapper;
                 })
                 .catch(function(erro) {
                   return $q.reject(erro);
                 });
     };
    }]);

}(angular));
