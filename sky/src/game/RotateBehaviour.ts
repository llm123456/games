namespace game {

    export class RotateBehaviour extends paper.Behaviour {

        private time = 0;

        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT)
        speed: number = 1;

        onUpdate(deltaTime: number) {
            this.time += deltaTime;
            const rotation = this.gameObject.transform.getLocalRotation();
            const x = this.time * this.speed;
            const newRotation = rotation.fromEuler({ x: x, y: x, z: x })
            this.gameObject.transform.setLocalRotation(newRotation);
        }
    }
}