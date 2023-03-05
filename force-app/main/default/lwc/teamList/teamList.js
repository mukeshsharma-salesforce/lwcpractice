import { LightningElement,wire,track, api } from 'lwc';
import getTeamMemberById from "@salesforce/apex/TeamController.getTeamMemberById";
export default class TeamList extends LightningElement {
    @track teamsOptions;
    @track records;
    @api itemId='';
    @track col = [
        { label: 'Name', fieldName: 'Name', type: 'text',  sortable: "true",editable: true},
        { label: 'Team', fieldName: 'TeamName', type: 'text'  },
        { label: 'Skills', fieldName: 'Skills', type: 'text' }
    ];

    connectedCallback() {
        debugger;
        this.getMemberList(this.itemId)
    }

    // handleChange(event){
    //     debugger;
    //     this.itemId = event.target.value;
    //     getMemberList(this.itemId);
    // }
    @api
    getMemberList(itemId) {
        getTeamMemberById({teamId:itemId})
        .then(result => {
            debugger;  
            if (result) {
                this.records=result;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    // @wire(getTeamMemberById,{teamId:'$itemId'})
    //     getRecords(result){
    //         debugger;  
    //         if (result.data) {
    //             this.records=result.data;
    //         }
    //     }
}