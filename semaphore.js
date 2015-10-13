/**
 * $semaphore
 * 
 * Controle de concorrencia de requisicao (semafaro)
 * 
 * @module $semaphore
 * @author Cleber de Moraes Goncalves <cleber.programmer>
 * @example
 * 
 *        $semaphre(function request(url, callback) {
 *     
 *          if (!!localStorage.getItem(url)) {
 *            return callback(localStorage.getItem(url));
 *          } 
 *        
 *          $http('GET', url, '').when(200, function (data) {
 *            localStorage.setItem(url, data);
 *            callback(data);
 *          });
 *          
 *        });
 * 
 */
this.Atomic.module('$semaphore', ['$apply', '$forEach'], function ($apply, $forEach, _) {
  
  /**
   * Controle de concorrencia de requisicao
   * 
   * @public
   * @method $semaphore
   * @param {Object} store Objeto que guarda os parametros de entrada como o $memoize
   * @param {Function} predicate Funcao que executa a acao principal
   * @return {Function} Funcao que encapsula o funcionamento da fila
   * @example
   * 
   *        $semaphre(function request(url, callback) {
   *     
   *          if (!!localStorage.getItem(url)) {
   *            return callback(localStorage.getItem(url));
   *          } 
   *        
   *          $http('GET', url, '').when(200, function (data) {
   *            localStorage.setItem(url, data);
   *            callback(data);
   *          });
   *          
   *        });
   * 
   */
  function semaphore(store, predicate) {
    
    /**
     * 
     */
    function controller(description, callback) {
      
      if (this._result) {
        return void(callback(this._result));
      }
  
      (this._listeners = this._listeners || []).push(callback);
  
      if (this._listeners.length > 1) {
        return;
      }
      
      function response(data) {
        $forEach(this._listeners, $apply(_, [this._result = data]));
      }
  
      predicate(description, response.bind(this));
      
    }
    
    /**
     * 
     */
    function resolve(a) {
      return store[a] = store[a] || controller.bind({});
    }
    
    /**
     * 
     */
    return function (description, callback) {
      resolve(JSON.stringify(description))(description, callback);
    };
    
  }
  
  /**
   * Revelacao do servico $semaphore, encapsulando a visibilidade das funcoes
   * privadas
   */
  return semaphore.bind(null, {});
  
});