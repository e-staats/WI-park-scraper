import React from 'react';
import DateRangePicker from "./DateRangePicker"
import { DateUtils } from 'react-day-picker';
import ParkSelector from "./parkCheckboxes"

class Form extends React.Component {
  northwest = {
    'Amnicon Falls': 1,
    'Big Bay': 3,
    'Brule River': 7,
    'Brunet Island': 8,
    'Chippewa Flowage': 11,
    'Chippewa Moraine': 12,
    'Copper Falls': 13,
    'Flambeau River': 17,
    'Governor Knowles': 21,
    'Interstate': 27,
    'Lake Wissota': 34,
    'Pattison': 45,
    'Straight Lake': 55,
    'Turtle Flambeau': 57,
    'Willow River': 61,
  }

  northeast = {
    'Council Grounds': 14,
    'Governor Earl Peshtigo River': 20,
    'Governor Thompson': 23,
    'Hartman Creek': 25,
    'High Cliff': 26,
    'Menominee River': 37,
    'Newport': 43,
    'Northern Highland - American Legion': 44,
    'Peninsula': 46,
    'Point Beach': 48,
    'Potawatomi': 49,
    'Rib Mountain': 50,
    'Rock Island': 53,
    'Whitefish Dunes': 58,
    'Willow Flowage': 60,
  }

  southeast = {
    'Black River': 5,
    'Blue Mound': 6,
    'Buckhorn': 9,
    'Cadiz Springs': 10,
    'Devil': 15,
    'Elroy-Sparta': 16,
    'Governor Dodge': 19,
    'Governor Nelson': 22,
    'Lake Kegonsa': 33,
    'Mackenzie Center': 36,
    'Merrick': 38,
    'Mill Bluff': 39,
    'Mirror Lake': 40,
    'Nelson Dewey': 41,
    'New Glarus Woods': 42,
    'Perrot': 47,
    'Roche-A-Cri': 52,
    'Rocky Arbor': 54,
    'Tower Hill': 56,
    'Wildcat Mountain': 59,
    'Wyalusing': 62,
    'Yellowstone Lake': 63,
  }

  southwest = {
    'Aztalan': 2,
    'Big Foot Beach': 4,
    'Glacial Drumlin': 18,
    'Harrington Beach': 24,
    'Kettle Moraine - Lapham Peak Unit': 28,
    'Kettle Moraine - Northern Unit': 29,
    'Kettle Moraine - Pike Lake Unit': 30,
    'Kettle Moraine - Southern Unit': 31,
    'Kohler-Andrae': 32,
    'Lakeshore': 35,
    'Richard Bong': 51,
  }

  convertParksToList = (parkObj) => {
    let returnList = []
    for (let parkName in parkObj) {
      returnList.push(this.stateItem(parkObj[parkName], parkName))
    }
    return returnList
  }

  stateItem = (id, parkName) => {
    return (
      {
        id: id, name: parkName, isChecked: false,
      }
    )
  }

  state = {
    parks: {
      allChecked: true,
      northwest: {
        name: "northwest",
        allChecked: false,
        parkList: this.convertParksToList(this.northwest),
      },
      southwest: {
        name: "southwest",
        allChecked: false,
        parkList: this.convertParksToList(this.southwest),
      },
      northeast: {
        name: "northeast",
        allChecked: false,
        parkList: this.convertParksToList(this.northeast),
      },
      southeast: {
        name: "southeast",
        allChecked: false,
        parkList: this.convertParksToList(this.southeast),
      },
    },
    //mapping names to values from database:
    regions: { "northwest": 1, "northeast": 3, "southwest": 2, "southeast": 4 },
    from: undefined,
    to: undefined,
    success: false
  }

  handleDayClick = (day) => {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  handleResetClick = () => {
    this.setState(this.getInitialState());
  }

  updateAllRegionalCheckboxes = (parks, name, checked) => {
    parks[name]["parkList"] = parks[name]["parkList"].map(item => ({ ...item, isChecked: checked }))
    parks[name]['allChecked'] = checked
    return parks
  }

  handleCheckboxChange = (e, name) => {
    let itemName = e.target.name;
    let checked = e.target.checked;
    this.setState(prevState => {
      let parks = prevState['parks']
      switch (itemName) {
        case ("allChecked"):
          parks = this.updateAllRegionalCheckboxes(parks, name, checked)
          break
        default:
          parks[name]['parkList'] = parks[name]['parkList'].map(item =>
            item.name === itemName ? { ...item, isChecked: checked } : item
          );
          parks[name]['allChecked'] = parks[name]['parkList'].every(item => item.isChecked);
      }
      return { parks };
    })
  };

  handleSelectAllButtonClick = (e, checkedOverride = null) => {
    let checked = checkedOverride
    if (checked === null) {
      e.target.name === "checkAll" ? checked = true : checked = false
    }
    this.setState(prevState => {
      let parks = prevState['parks']
      for (let regionName in prevState.regions) {
        parks = this.updateAllRegionalCheckboxes(parks, regionName, checked)
      }
      return { parks };
    })
  };

  assemblePreferredRegions = () => {
    let regionString = ""
    for (let regionName in this.state.regions) {
      if (this.state['parks'][regionName]['allChecked'] === true) {
        regionString += this.state.regions[regionName].toString() + ","
      }
    }
    return regionString
  }

  assembleParkString = () => {
    let parkString = ""
    for (let regionName in this.state.regions) {
      for (let parkObj of this.state['parks'][regionName]['parkList']) {
        if (parkObj.isChecked === true) {
          parkString += parkObj['id'].toString() + ","
        }
      }
    }
    return parkString
  }

  validateDatesForSubmit = () => {
    //validate and assemble data
    let error = false

    if (this.state.from === undefined) {
      console.log("from date error - I should handle this better")
      error = true
    }

    if (this.state.to === undefined) {
      console.log("to date error - I should handle this better")
      error = true
    }

    if (error === true) {
      alert("error")
      return
    }

    return {
      from: this.state.from,
      to: this.state.to
    }
  }

  validateRegionsForSubmit = () => {
    //validate and assemble data
    let error = false
    let preferredRegions = this.assemblePreferredRegions()
    if (preferredRegions === undefined) {
      console.log("regions - I should handle this better")
      error = true
    }

    if (error === true) {
      return "Issue with Region list"
    }

    return preferredRegions
  }

  validateParksForSubmit = () => {
    //validate and assemble data
    let error = false
    let parkList = this.assembleParkString()
    if (parkList === undefined) {
      console.log("parks - I should handle this better")
      error = true
    }

    if (error === true) {
      return "Issue with Park list"
    }

    return parkList
  }

  handleSubmit = () => {

    let dates = this.validateDatesForSubmit()
    let regions = this.validateRegionsForSubmit()
    let parks = this.validateParksForSubmit()
    if (dates === undefined || regions === undefined || parks === undefined) {
      return
    }

    let fromDate = dates.from.toISOString()
    let toDate = dates.to.toISOString()

    //call down to server
    fetch('/_submit_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      body: JSON.stringify({
        'start_date': fromDate,
        'end_date': toDate,
        'regions': regions,
        'parks': parks,
      }),
    }).then(() => {
      this.handleSelectAllButtonClick(null, false)
      this.handleResetClick()
      this.setState(prevState => {
        prevState.success = true
        return prevState
      })
    })
  }

  getInitialState() {
    return {
      from: undefined,
      to: undefined,
    };
  }

  render() {
    let successBanner = ""
    if (this.state.success === true) {
      successBanner = <div>Search submitted!</div>
    }

    return (<div>
      <div>
        <h3>Choose the dates you would like to camp:</h3>
        <DateRangePicker handleDayClick={this.handleDayClick} handleResetClick={this.handleResetClick} from={this.state.from} to={this.state.to} />
      </div>
      <div>
        <h3>Choose the parks you would like to stay at:</h3>
        <ParkSelector
          handleCheckboxChange={this.handleCheckboxChange}
          handleSelectAllButtonClick={this.handleSelectAllButtonClick}
          parks={this.state.parks}
        />
      </div>
      <button className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
      {successBanner}
    </div>)
  }
}


export default Form;