import { LightningElement, track } from 'lwc';
import saveTeamMember from "@salesforce/apex/TeamController.saveTeamMember";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class MemberSkills extends LightningElement {
    name;
    teamId;
    skill;
    @track teams;
    handleTeamMember(event) {
        this.name = event.target.value;  
    }
    handleTeamsChange(event) {
            this.teamId = event.detail.teamId; 
    }
    handleTeamsListChange(event) {
            this.template.querySelector('c-team-list').getMemberList(event.detail.teamId);
    }

    handleSkillChange(event) {
        this.skill = event.target.value; 
    }
    submitForm(event) {
        if (this.name.length >0 && this.teamId.length >0 && this.skill.length >0) {
            let member ={
                name : this.name,
                skills : this.skill,
                teamId : this.teamId
            }
            let memberString = JSON.stringify(member);
            try {
                saveTeamMember({memberJSON: memberString})
                .then((result)=>{
                    this.template.querySelector('form').reset();
                    this.value = null;
                    const evt = new ShowToastEvent({
                        title: "Success",
                        message: "Team Member created successfully!",
                        variant: "success",
                        mode: 'pester'
                    });
                    this.dispatchEvent(evt);
                    this.template.querySelector('c-team-list').getMemberList();
                })
                .catch((error) => {
                    console.log('error : ',error);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error",
                            message: "server error",
                            variant: "error",
                            mode: 'pester'
                        })
                    );
                });
            } catch (error) {
                console.error('check error here', error);
            }
        }
        else{
            alert('Fields are empty');
        }

    }
}