import { LightningElement,wire,track } from 'lwc';
import getItems from "@salesforce/apex/TeamController.getTeams";
export default class TeamSelection extends LightningElement {
    @track teamsOptions;
    @wire(getItems, {})
    teams({ error, data }) {
        if (data) {
            try {
                let options = [];
                for (var key in data) {
                    options.push({ label: data[key].Name, value: data[key].Id  });
                }
                this.teamsOptions = options;
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
 
    }
    handleTeamsChange(event) {
        var team = new CustomEvent("getselectedteam",{
            detail: {teamId: event.target.value}
        });
        this.dispatchEvent(team);
    }
}