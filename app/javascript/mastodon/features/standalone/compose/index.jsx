import ComposeFormContainer from 'tucano/features/compose/containers/compose_form_container';
import LoadingBarContainer from 'tucano/features/ui/containers/loading_bar_container';
import ModalContainer from 'tucano/features/ui/containers/modal_container';
import NotificationsContainer from 'tucano/features/ui/containers/notifications_container';

const Compose = () => (
  <>
    <ComposeFormContainer autoFocus withoutNavigation />
    <NotificationsContainer />
    <ModalContainer />
    <LoadingBarContainer className='loading-bar' />
  </>
);

export default Compose;
