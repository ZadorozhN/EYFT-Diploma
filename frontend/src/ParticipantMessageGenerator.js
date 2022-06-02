class ParticipantMessageGenerator {
    constructor(){
        this.number = '';
        this.pluralModifier = '';
        this.verb = '';
    }

    make(participantsAmount) {
        this.createMessageParts(participantsAmount)

        return `${this.number} участник${this.pluralModifier} ${this.verb}`
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
        this.number = '0';
        this.verb = 'присоединилось';
        this.pluralModifier = 'ов';
    }

    thereIsOneParticipant() {
        this.number = '1';
        this.verb = 'присоединился';
        this.pluralModifier = '';
    }

    thereAreManyParticipants(participantsAmount) {
        this.number = participantsAmount;
        this.verb = 'присоединились';
        this.pluralModifier = 'ов';
    }
}

export default ParticipantMessageGenerator