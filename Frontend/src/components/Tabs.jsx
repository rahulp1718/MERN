import { TABS } from "../Redux/actions/types";
import { useDispatch } from "react-redux";
import { toggleTab } from "../Redux/actions";
import { useEffect } from "react";

const Tabs = ({ currentTab }) => {
  const defaultTab = currentTab || TABS[0];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleTab(defaultTab));
  }, [dispatch, defaultTab]);
  return (
    <>
      {TABS.map((tab) => {
        return (
          <button
            key={tab}
            onClick={() => dispatch(toggleTab(tab))}
            className="text-sm p-1 rounded font-semibold"
            style={
              currentTab === tab
                ? { backgroundColor: "blue", color: "white" }
                : { backgroundColor: "white", color: "blue" }
            }
          >
            {tab}
          </button>
        );
      })}
    </>
  );
};

export default Tabs;
