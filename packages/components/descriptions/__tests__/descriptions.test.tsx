import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import LpTag from '@lemon-peel/components/tag';
import LpDescriptions from '../src/Description.vue';
import LpDescriptionsItem from '../src/descriptionItem';

describe('Descriptions.vue', () => {
  test('render test', () => {
    const wrapper = mount(() => (
      <LpDescriptions title="title" extra="extra">
        {Array.from({ length: 4 }).map(() => (
          <LpDescriptionsItem />
        ))}
      </LpDescriptions>
    ));

    expect(wrapper.find('.lp-descriptions__title').text()).toEqual('title');
    expect(wrapper.find('.lp-descriptions__extra').text()).toEqual('extra');
    expect(wrapper.findAll('.lp-descriptions__label').length).toEqual(4);
  });

  test('should render border props', () => {
    const wrapper = mount(() => (
      <LpDescriptions border>
        <LpDescriptionsItem />
      </LpDescriptions>
    ));

    expect(wrapper.find('table').classes()).toContain('is-bordered');
  });

  test('should render align props', () => {
    const wrapper = mount(() => (
      <LpDescriptions border>
        {Array.from({ length: 3 }).map(() => (
          <LpDescriptionsItem align="right" labelAlign="center" />
        ))}
      </LpDescriptions>
    ));

    expect(wrapper.find('.lp-descriptions__label').classes()).toContain(
      'is-center',
    );
    expect(wrapper.find('.lp-descriptions__content').classes()).toContain(
      'is-right',
    );
  });

  test('should render width props', () => {
    const wrapper = mount(() => (
      <LpDescriptions border>
        {Array.from({ length: 3 }).map(() => (
          <LpDescriptionsItem width="50px" min-width="60px" />
        ))}
      </LpDescriptions>
    ));

    expect(
      wrapper.find('.lp-descriptions__label').attributes('style'),
    ).toContain('width: 50px; min-width: 60px;');
    expect(
      wrapper.find('.lp-descriptions__content').attributes('style'),
    ).toContain('width: 50px; min-width: 60px;');
  });

  test('should render class props', () => {
    const wrapper = mount(() => (
      <LpDescriptions border>
        {Array.from({ length: 3 }).map(() => (
          <LpDescriptionsItem
            class-name="class-name"
            label-class-name="label-class-name"
          />
        ))}
      </LpDescriptions>
    ));

    expect(wrapper.find('.lp-descriptions__label').classes()).toContain(
      'label-class-name',
    );
    expect(wrapper.find('.lp-descriptions__content').classes()).toContain(
      'class-name',
    );
  });

  test('should render column props', async () => {
    const border = ref(false);

    const wrapper = mount(() => (
      <LpDescriptions column={5} border={border.value}>
        {Array.from({ length: 10 }).map(() => (
          <LpDescriptionsItem />
        ))}
      </LpDescriptions>
    ));

    expect(wrapper.find('tr').element.children.length).toEqual(5);

    border.value = true;

    await nextTick();

    expect(wrapper.find('tr').element.children.length).toEqual(10);
  });

  test('should render direction props', async () => {
    const direction = ref<'horizontal' | 'vertical'>('horizontal');

    const wrapper = mount(() => (
      <LpDescriptions column={5} direction={direction.value} border>
        {Array.from({ length: 10 }).map(item => (
          <LpDescriptionsItem label={String(item)}>
            {String(item)}
          </LpDescriptionsItem>
        ))}
      </LpDescriptions>
    ));

    expect(wrapper.find('tr').element.children.length).toEqual(10);
    expect(wrapper.findAll('tr')[0].element.children[0].innerHTML).toEqual(
      wrapper.findAll('tr')[0].element.children[1].innerHTML,
    );

    direction.value = 'vertical';
    await nextTick();

    expect(wrapper.find('tr').element.children.length).toEqual(5);
    expect(wrapper.findAll('tr')[0].element.children[0].innerHTML).toEqual(
      wrapper.findAll('tr')[1].element.children[0].innerHTML,
    );
  });

  test('should render title slots', async () => {
    const wrapper = mount(() => (
      <LpDescriptions
        v-slots={{
          title: () => 'title',
          default: () =>
            Array.from({ length: 10 }).map(() => <LpDescriptionsItem />),
        }}
      ></LpDescriptions>
    ));

    expect(wrapper.find('.lp-descriptions__title').text()).toEqual('title');
  });

  test('should render span props', async () => {
    const wrapper = mount(() => (
      <LpDescriptions>
        <LpDescriptionsItem label="1">1</LpDescriptionsItem>
        <LpDescriptionsItem label="2" span={2}>
          2
        </LpDescriptionsItem>
        <LpDescriptionsItem label="3">3</LpDescriptionsItem>
        <LpDescriptionsItem label="4">4</LpDescriptionsItem>
      </LpDescriptions>
    ));

    expect(wrapper.findAll('td')[1].element.getAttribute('colSpan')).toEqual(
      '2',
    );
    expect(wrapper.findAll('td')[3].element.getAttribute('colSpan')).toEqual(
      '2',
    );
  });

  test('re-rendered when slots is updated', async () => {
    const CHANGE_VALUE = 'company';
    const remarks = ref(['school', 'hospital']);

    const onClick = () => {
      remarks.value[0] = CHANGE_VALUE;
    };

    const wrapper = mount(() => (
      <>
        {remarks.value.map((remark, index) => (
          <LpDescriptions key={index} title={remark}>
            <LpDescriptionsItem label={remark}>
              <LpTag size="small">{remark}</LpTag>
            </LpDescriptionsItem>
          </LpDescriptions>
        ))}
        <button onClick={onClick}>click</button>
      </>
    ));

    wrapper.find('button').trigger('click');
    await nextTick();
    expect(wrapper.findComponent(LpTag).text()).toBe(CHANGE_VALUE);
  });
});
