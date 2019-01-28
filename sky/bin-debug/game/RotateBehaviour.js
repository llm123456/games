var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var game;
(function (game) {
    var RotateBehaviour = (function (_super) {
        __extends(RotateBehaviour, _super);
        function RotateBehaviour() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.time = 0;
            _this.speed = 1;
            return _this;
        }
        RotateBehaviour.prototype.onUpdate = function (deltaTime) {
            this.time += deltaTime;
            var rotation = this.gameObject.transform.getLocalRotation();
            var x = this.time * this.speed;
            var newRotation = rotation.fromEuler({ x: x, y: x, z: x });
            this.gameObject.transform.setLocalRotation(newRotation);
        };
        __decorate([
            paper.serializedField,
            paper.editor.property("FLOAT" /* FLOAT */)
        ], RotateBehaviour.prototype, "speed", void 0);
        return RotateBehaviour;
    }(paper.Behaviour));
    game.RotateBehaviour = RotateBehaviour;
    __reflect(RotateBehaviour.prototype, "game.RotateBehaviour");
})(game || (game = {}));
//# sourceMappingURL=RotateBehaviour.js.map