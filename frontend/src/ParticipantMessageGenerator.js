class ParticipantMessageGenerator {
    constructor(){
        this.number = '';
        this.pluralModifier = '';
        this.verb = '';
    }

    make(participantsAmount) {
        this.createMessageParts(participantsAmount)

        return `${this.number} participant${this.pluralModifier} ${this.verb} joined the event`
    }

    createMessageParts(participantsAmount) {
        if (participantsAmount == 0) {
            this.thereAreNoParticipants()
        } else if (participantsAmount == 1) {
            this.thereIsOneParticipant()
        } else {
            this.thereAreManyParticipants(participantsAmount)
        }
    }

    thereAreNoParticipants() {
        this.number = 'No';
        this.verb = 'have';
        this.pluralModifier = 's';
    }

    thereIsOneParticipant() {
        this.number = '1';
        this.verb = 'has';
        this.pluralModifier = '';
    }

    thereAreManyParticipants(participantsAmount) {
        this.number = participantsAmount;
        this.verb = 'have';
        this.pluralModifier = 's';
    }
}

export default ParticipantMessageGenerator