import React from 'react';
import {
  OptionListCheck, OptionListInput,
  OptionListInputContainer,
  OptionListItem,
  OptionListItemLabel,
} from './style';

interface OptionListItemProps {
  value: string;
  label: string;
  excludable?: boolean;
}
interface OptionListValue {
  selected: string[];
  other?: string;
}

interface OptionListProps {
  value?: OptionListValue;
  items: OptionListItemProps[];
  excludableValues?: string[];
  singleSelection?: boolean;
  onChange?: (value: OptionListValue) => void;
  allowAddOther?: boolean;
  addOtherLabel?: string;
  enableOther?: boolean;
  otherPlaceholder?: string;
  isCheckbox?: boolean;
}
const defaultValue = { selected: [], other: '' };

const OptionList = ({
  value = defaultValue, items, excludableValues, singleSelection, isCheckbox,
  onChange, allowAddOther, otherPlaceholder,
}: OptionListProps) => {

  const selectItem = (selectedItem: OptionListItemProps) => {
    const { selected = [] } = value;
    let newSelected: string[] = [];

    const index = selected.findIndex(item => item.startsWith(selectedItem.value));

    if (index >= 0) {
      newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)];
    } else if (singleSelection) {
      newSelected = [selectedItem.value];
    } else if (excludableValues?.includes(selectedItem.value)
      || (excludableValues && selected.some(item => excludableValues.includes(item)))) {
      newSelected = [selectedItem.value];
    } else {
      newSelected = [...selected, selectedItem.value];
    }

    onChange?.({
      selected: newSelected,
    });
  };

  const otherChangeHandler = (newOtherValue: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { selected = [] } = value;
    const newSelected = selected.filter(item => !item.startsWith('other:'));
    if (newOtherValue) {
      newSelected.push(`other: ${newOtherValue}`);
    }

    onChange?.({
      selected: newSelected,
    });
  };

  return (
    <>
      {items.map((item, index) => {
        const isSelected = value.selected.some(val => val === item.value || val.startsWith(`${item.value}:`));
        return (
          <OptionListItem
            key={item.value}
            lastItem={items.length === index + 1 && !allowAddOther && item.value === 'other'}
            onClick={() => selectItem(item)}
            isSelected={isSelected}
          >
            <OptionListItemLabel>
              {item.label}
            </OptionListItemLabel>
            <OptionListCheck isSelected={isSelected} checkbox={isCheckbox} />
            {item.value === 'other' && 
            <OptionListInputContainer>
              <OptionListInput
                placeholder={otherPlaceholder}
                value={value.selected.find(item => item.startsWith('other:'))?.split(': ')[1] || ''}
                isSelected={!!value.selected.find(item => item.startsWith('other:'))}
                onClick={(e) => e.stopPropagation()}
                onChange={e => otherChangeHandler(e.target.value, e)}
              />
          </OptionListInputContainer>}

          </OptionListItem>
        );
      })}
    </>
  );
};

OptionList.defaultProps = {
  value: defaultValue,
  excludableValues: undefined,
  singleSelection: false,
  onChange: undefined,
  allowAddOther: false,
  addOtherLabel: '',
  enableOther: false,
  otherPlaceholder: '',
};

export default React.memo(OptionList);
