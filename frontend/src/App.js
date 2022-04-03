import React, { Component } from 'react';
import './App.css';
import Home from './Main/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserList from './UserList.js';
import UserEdit from './UserEdit.js';
import AuthForm from './AuthForm';
import RegistrationForm from './RegistrationForm';
import CreateEventForm from './CreateEventForm';
import EventList from './Admin/Event/EventList.js';
import EventEdit from './Admin/Event/EventEdit.js';
import CreateCategoryForm from './Category/CreateCategoryForm';
import CategoryList from './Category/CategoryList';
import PersonalPage from './Me/PersonalPage';
import JoinEvents from './Me/JoinEvents';
import AdminPage from './Admin/AdminPage';
import ArrangerPage from './Arranger/ArrangerPage'
import EventArrangement from './Arranger/EventArrangement';
import ArrangedEvents from './Arranger/ArrangedEvents.js';
import EventPage from './EventPage';
import ArrangedEventPage from './Arranger/ArrangedEventPage';
import GuestPersonalPage from './Me/Guest/GuestPersonalPage';
import PropsPage from './Admin/Prop/PropsPage'
import CreateProp from './Admin/Prop/CreateProp'
import PropEdit from './Admin/Prop/PropEdit';
import ArrangementProps from './Arranger/PropsForArrangement/ArrangementProps';
import MyProps from './Arranger/PropsForArrangement/MyProps';
import MyPage from './Me/MyPage';
import PropOrdersHandler from './Admin/Prop/PropOrdersHandler';
import MySettings from './Me/MySettings';
import MyPhotos from './Me/MyPhotos';
import MyMessenger from './Me/MyMessenger';
import MyJoinedEvents from './Me/MyJoinedEvents';
import DepositWithdrawPage from './BankCard/DepositWithdrawPage';

class App extends Component {
  state = {
    isLoading: true,
    users: []
  };

  render() {
    return (
      <Router>
         <Switch>
           <Route path='/' exact={true} component={Home}/>
           <Route path='/card' exact={true} component={DepositWithdrawPage}/>
           {/* <Route path='/me' exact={true} component={PersonalPage}/> */}
           <Route path='/me' exact={true} component={MyPage}/>
           <Route path='/me/settings' exact={true} component={MySettings}/>
           <Route path='/me/photos' exact={true} component={MyPhotos}/>
           <Route path='/me/messenger' exact={true} component={MyMessenger}/>
           <Route path='/me/events' exact={true} component={JoinEvents}/>
           <Route path='/me/joined' exact={true} component={MyJoinedEvents}/>
           {/* <Route path='/me/join-events' exact={true} component={JoinEvents}/> */}
           <Route path='/admin' exact={true} component={AdminPage}/>
           <Route path='/arranger' exact={true} component={ArrangerPage}/>
           <Route path='/arranger/props/market' exact={true} component={ArrangementProps}/>
           <Route path='/arranger/props/ordered' exact={true} component={MyProps}/>
           <Route path='/arranger/arranged' exact={true} component={ArrangedEvents}/>
           <Route path='/arranger/arranged/:id' exact={true} component={ArrangedEventPage}/>
           <Route path='/arranger/arrangement' exact={true} component={EventArrangement}/>
           <Route path='/auth' exact={true} component={AuthForm}/>
           <Route path='/registration' exact={true} component={RegistrationForm}/>
           <Route path='/user-management/users' exact={true} component={UserList}/>
           <Route path='/user-management/users/:id' exact={true} component={UserEdit}/>
           <Route path='/events' exact={true} component={CreateEventForm}/>
           <Route path='/event-management/events' exact={true} component={EventList}/>
           <Route path='/event-management/events/:id' exact={true} component={EventEdit}/>
           <Route path='/category-management/categories/create' exact={true} component={CreateCategoryForm}/>
           <Route path='/category-management/categories' exact={true} component={CategoryList}/>
           <Route path='/prop-management/props/' exact={true} component={PropsPage}/>
           <Route path='/prop-management/propOrders/' exact={true} component={PropOrdersHandler}/>
           <Route path="/prop-management/props/create" exact={true} component={CreateProp}/>
           <Route path="/prop-management/props/:id" exact={true} component={PropEdit}/>
           <Route path='/events/:id' exact={true} component={EventPage}/>
           <Route path='/guest/:login' exact={true} component={GuestPersonalPage}/>
         </Switch>
      </Router>
    )
  }
}

export default App;