// Generated by CoffeeScript 1.6.3
(function() {
  var Store, localStorage;

  Store = window.Store, localStorage = window.localStorage;

  describe('window.Store', function() {
    var model, store, _ref;
    _ref = {}, store = _ref.store, model = _ref.model;
    beforeEach(function() {
      localStorage.clear();
      localStorage.setItem('cats', '3');
      localStorage.setItem('cats3', '{"id": "3", "color": "burgundy"}');
      return store = new Store('cats');
    });
    describe('creation', function() {
      return it('takes a name in its constructor', function() {
        store = new Store('convenience store');
        return expect(store.name).toBe('convenience store');
      });
    });
    describe('persistence', function() {
      describe('find', function() {
        it('fetches records by id', function() {
          return store.find({
            id: 3
          }).done(function(result) {
            return expect(result).toEqual({
              id: '3',
              color: 'burgundy'
            });
          });
        });
        it('does not try to JSON.parse null values', function() {
          spyOn(JSON, 'parse');
          return store.find({
            id: 'unpersistedId'
          }).done(function() {
            return expect(JSON.parse).not.toHaveBeenCalledWith(null);
          });
        });
        return it('returns null when not found', function() {
          return store.find({
            id: 'unpersistedId'
          }).done(function(result) {
            return expect(result).toBeNull();
          });
        });
      });
      it('fetches all records with findAll', function() {
        return store.findAll().done(function(result) {
          return expect(result).toEqual([
            {
              id: '3',
              color: 'burgundy'
            }
          ]);
        });
      });
      it('clears out its records', function() {
        return store.clear().done(function() {
          expect(localStorage.getItem('cats')).toBe('');
          return expect(localStorage.getItem('cats3')).toBeNull();
        });
      });
      it('creates records', function() {
        model = {
          id: 2,
          color: 'blue'
        };
        return store.create(model).done(function() {
          expect(localStorage.getItem('cats')).toBe('3,2');
          return expect(JSON.parse(localStorage.getItem('cats2'))).toEqual({
            id: 2,
            color: 'blue'
          });
        });
      });
      it('overwrites existing records with the same id on create', function() {
        model = {
          id: 3,
          color: 'lavender'
        };
        return store.create(model).done(function() {
          return expect(JSON.parse(localStorage.getItem('cats3'))).toEqual({
            id: 3,
            color: 'lavender'
          });
        });
      });
      it('generates an id when creating records with no id', function() {
        localStorage.clear();
        store = new Store('cats');
        model = {
          color: 'calico',
          idAttribute: 'id',
          set: function(attribute, value) {
            return this[attribute] = value;
          }
        };
        return store.create(model).done(function() {
          expect(model.id).not.toBeNull();
          return expect(localStorage.getItem('cats')).toBe(model.id);
        });
      });
      it('updates records', function() {
        return store.update({
          id: 3,
          color: 'green'
        }).done(function() {
          return expect(JSON.parse(localStorage.getItem('cats3'))).toEqual({
            id: 3,
            color: 'green'
          });
        });
      });
      return it('destroys records', function() {
        return store.destroy({
          id: 3
        }).done(function() {
          expect(localStorage.getItem('cats')).toBe('');
          return expect(localStorage.getItem('cats3')).toBeNull();
        });
      });
    });
    return describe('offline', function() {
      it('on a clean slate, hasDirtyOrDestroyed returns false', function() {
        return store.hasDirtyOrDestroyed().done(function(result) {
          return expect(result).toBeFalsy();
        });
      });
      it('marks records dirty and clean, and reports if it hasDirtyOrDestroyed records', function() {
        return store.dirty({
          id: 3
        }).done(function() {
          return store.hasDirtyOrDestroyed().done(function(result) {
            expect(result).toBeTruthy();
            return store.clean({
              id: 3
            }, 'dirty').done(function() {
              return store.hasDirtyOrDestroyed().done(function(result) {
                return expect(result).toBeFalsy();
              });
            });
          });
        });
      });
      it('marks records destroyed and clean from destruction, and reports if it hasDirtyOrDestroyed records', function() {
        return store.destroyed({
          id: 3
        }).done(function() {
          return store.hasDirtyOrDestroyed().done(function(result) {
            expect(result).toBeTruthy();
            return store.clean({
              id: 3
            }, 'destroyed').done(function() {
              return store.hasDirtyOrDestroyed().done(function(result) {
                return expect(result).toBeFalsy();
              });
            });
          });
        });
      });
      return it('cleans the list of dirty or destroyed models out of localStorage after saving or destroying', function() {
        var collection;
        collection = new Backbone.Collection([
          {
            id: 2,
            color: 'auburn'
          }, {
            id: 3,
            color: 'burgundy'
          }
        ]);
        collection.url = 'cats';
        return store.dirty({
          id: 2
        }).done(function() {
          return store.destroyed({
            id: 3
          }).done(function() {
            return store.hasDirtyOrDestroyed().done(function(result) {
              expect(result).toBeTruthy();
              return collection.get(2).save().done(function() {
                return collection.get(3).destroy().done(function() {
                  return store.hasDirtyOrDestroyed().done(function(result) {
                    expect(result).toBeFalsy();
                    expect(localStorage.getItem('cats_dirty').length).toBe(0);
                    return expect(localStorage.getItem('cats_destroyed').length).toBe(0);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

}).call(this);
